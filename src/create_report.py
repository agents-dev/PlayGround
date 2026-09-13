"""Python end-to-end example from the docs (needs OPENAI_API_KEY)."""
from openai import OpenAI

client = OpenAI()
with open('examples/amounts.csv', 'rb') as f:
    import base64

    data = base64.b64encode(f.read()).decode()

stream = client.beta.agents.sessions.create(
    agent={"model": "gpt-6-astra"},
    environment={
        "type": "openai_hosted",
        "network": {"access": "disabled"},
        "files": [
            {
                "type": "inline",
                "path": "/workspace/amounts.csv",
                "data": data,
            }
        ],
    },
    input="Use Python to sum the amount column in /workspace/amounts.csv. "
    "Write a JSON object with the total to /workspace/outputs/summary.json, "
    "then read it back to verify it.",
    stream=True,
)

with stream:
    for event in stream:
        print(event.model_dump_json())
