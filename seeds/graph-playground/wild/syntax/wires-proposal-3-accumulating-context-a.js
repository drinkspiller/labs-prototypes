const board = {};
// import/add kit
const kit = {};

const Constant = (value) => () => value;

const generator = kit.generateText({
  $id: "generator",
  PALM_KEY: Constant(kit.secrets(["PALM_KEY"])),
});

// Store prompt node for the same reason.
const prompt = kit
  .promptTemplate({
    $id: "assistant",
    template:
      "This is a conversation between a friendly assistant and their user. You are the assistant and your job is to try to be helpful, empathetic, and fun.\n{{context}}\n\n== Current Conversation\nuser: {{question}}\nassistant:",
    context: ["", conversationMemory.accumulator],
  })
  .to({
    prompt: generator.in.text,
  });

board
  .passthrough({ $id: "start" })
  // no port specifier, so it means "all ports"
  .to(
    board.input({ $id: "userRequest" }).to({
      text: prompt.in.question,
    })
  );

// Store input node so that we can refer back to it to create a conversation
// loop.
// Arguments are configuration objects
const input = board.input({
  $id: "userRequest",
});

// Use the `append` node to accumulate the conversation history.
// Populate it with initial context.
const conversationMemory = kit.append({
  accumulator: "\n== Conversation History",
  $id: "conversationMemory",
});

// // Store prompt node for the same reason.
// const prompt = kit
//   .promptTemplate({
//     $id: "assistant",
//     template:
//       "This is a conversation between a friendly assistant and their user. You are the assistant and your job is to try to be helpful, empathetic, and fun.\n{{context}}\n\n== Current Conversation\nuser: {{question}}\nassistant:",
//     context: ["", conversationMemory.accumulator],
//     question: input.out.text,
//   })
//   .pipe({
//     prompt: kit.generateText({
//       $id: "generator",
//       PALM_KEY: Constant(kit.secrets(["PALM_KEY"])),
//     }).in.text,
//   });

conversationMemory.in({
  // loop conversationMemory.accumulator back into itself
  accumulator: conversationMemory.accumulator,
  assistant: generator.completion,
});

const output = board.output({
  $id: "assistantResponse",
  text: conversationMemory.accumulator,
});

input({
  // Note: specifying two wires in one line.
  $control: [board.passthrough({ $id: "start" }), output],
});
