/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { Board } from "@google-labs/breadboard";
import { Starter } from "@google-labs/llm-starter";

const simplePrompt = new Board({
  title: "Simple meta-reasoning",
  description:
    "Possibly the simplest meta-reasoning prompt. When asked a question, it encourages the LLM to analyze the question instead of answering it and provide steps to arrive at the solution",
  version: "0.0.1",
});
const kit = simplePrompt.addKit(Starter);

const completion = kit.generateText();
kit.secrets(["PALM_KEY"]).wire("PALM_KEY", completion);
simplePrompt
  .input({
    $id: "question",
    schema: {
      type: "object",
      properties: {
        text: {
          type: "string",
          title: "Question",
          description: "Ask a question for LLM to reason about",
        },
      },
      required: ["text"],
    },
  })
  .wire(
    "text->question",
    kit
      .promptTemplate(
        "Analyze the following question and instead of answering, list out steps to take to answer the question: {{question}}",
        { $id: "analyze-this" }
      )
      .wire(
        "prompt->text",
        completion.wire(
          "completion->text",
          simplePrompt.output({
            $id: "analysis",
            schema: {
              type: "object",
              properties: {
                text: {
                  type: "string",
                  title: "Steps",
                  description: "The steps to take to answer the question",
                },
              },
              required: ["text"],
            },
          })
        )
      )
  );

export default simplePrompt;
