"""Report example: sum amounts.csv in an OpenAI-hosted sandbox, download artifact."""
import os
import time
from openai import OpenAI

AMOUNTS_B64 = "YW1vdW50CjEwCjIwCjMwCg=="  # amount\n10\n20\n30\n
ARTIFACT_PATH = "/workspace/outputs/summary.json"


def download_artifact(client: OpenAI, session_id: str, turn_id, path: str, destination: str):
    for artifact in client.beta.agents.sessions.artifacts.list(session_id):
        if artifact.turn_id != turn_id or artifact.path != path:
            # If turn_id unknown, match on path only
            if not (turn_id is None and artifact.path == path):
                continue
        with client.beta.agents.sessions.artifacts.with_streaming_response.content(
            artifact.id, session_id=session_id
        ) as response:
            response.stream_to_file(destination)
        return
    raise FileNotFoundError(f"No artifact for {path!r} in turn {turn_id}")


def main() -> None:
    client = OpenAI()  # reads OPENAI_API_KEY from env
    stream = client.beta.agents.sessions.create(
        agent={"model": "gpt-6-astra"},
        environment={
            "type": "openai_hosted",
            "network": {"access": "disabled"},
            "files": [
                {"type": "inline", "path": "/workspace/amounts.csv", "data": AMOUNTS_B64}
            ],
        },
        input=(
            "Use Python to sum the amount column in /workspace/amounts.csv. "
            "Write a JSON object with the total to /workspace/outputs/summary.json, "
            "then read it back to verify it."
        ),
        stream=True,
    )
    session_id = None
    turn_id = None
    with stream:
        for event in stream:
            print(event.model_dump_json())
            d = event.model_dump()
            if d.get("type") == "agent.session.created":
                session_id = (d.get("session") or {}).get("id", session_id)
            session_id = session_id or d.get("session_id") or (d.get("session") or {}).get("id")
            turn_id = turn_id or d.get("turn_id") or (d.get("turn") or {}).get("id")
            t = d.get("type", "")
            if t == "agent.session.turn.completed":
                turn_id = (d.get("turn") or {}).get("id", turn_id) or d.get("turn_id", turn_id)
                break
            if t in (
                "agent.session.turn.failed",
                "agent.session.turn.cancelled",
                "agent.session.failed",
            ):
                raise SystemExit(f"Terminal event: {t}")

    if not session_id:
        raise SystemExit("No session_id captured; cannot list artifacts.")
    print(f"\nsession_id={session_id} turn_id={turn_id}")

    os.makedirs("outputs", exist_ok=True)
    download_artifact(client, session_id, turn_id, ARTIFACT_PATH, "outputs/summary.json")
    with open("outputs/summary.json") as f:
        print(f"Downloaded {ARTIFACT_PATH} -> outputs/summary.json: {f.read().strip()}")

    # Cleanup with retry on 409 (setup/execution still finishing).
    for attempt in range(5):
        try:
            print(client.beta.agents.sessions.delete(session_id).to_json())
            break
        except Exception as e:  # noqa: BLE001 - surface then retry on 409
            if "409" not in str(e) or attempt == 4:
                raise
            time.sleep(2**attempt)


if __name__ == "__main__":
    main()
