"""Quickstart: create + run tree.py in an OpenAI-hosted sandbox, stream events."""
from openai import OpenAI

with OpenAI() as client:  # reads OPENAI_API_KEY from env
    with client.beta.agents.sessions.create(
        agent={
            "model": "gpt-6-astra",
            "instructions": "Write clean code, run it, and report the actual output.",
        },
        environment={"type": "openai_hosted"},
        input=(
            "Create tree.py, a Python script that prints a readable tree of "
            "the files in the current directory. Run it and show me the output."
        ),
        stream=True,
    ) as events:
        for event in events:
            print(event.to_json(indent=None), flush=True)
            t = getattr(event, "type", "")
            if t in (
                "agent.session.turn.completed",
                "agent.session.turn.failed",
                "agent.session.turn.cancelled",
                "agent.session.failed",
            ):
                if t != "agent.session.turn.completed":
                    raise SystemExit(f"Terminal event: {t}")
                break
