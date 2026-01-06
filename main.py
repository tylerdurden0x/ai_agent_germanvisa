from agent.agent import VisaAgent

agent = VisaAgent()

print("German Student Visa AI Agent (Mumbai VFS)")
print("Type 'exit' to quit")

while True:
    question = input("\nAsk a question: ")

    if question.lower() == "exit":
        break

    answer = agent.answer(question)
    print("\nAgent:", answer)
