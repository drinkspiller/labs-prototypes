/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import type {
  BreadboardNode,
  Kit,
  NodeFactory,
  OptionalIdConfiguration,
  InputValues,
  NodeHandlers,
  NodeTypeIdentifier,
  OutputValues,
} from "@google-labs/breadboard";
import generateText, {
  GenerateTextInputs,
  GenerateTextOutputs,
} from "./nodes/generate-text.js";
import embedText, { EmbedTextInputs } from "./nodes/embed-text.js";
import xmlToJson, {
  XmlToJsonInputs,
  XmlToJsonOutputs,
} from "./nodes/xml-to-json.js";
import jsonata, { JsonataInputs, JsonataOutputs } from "./nodes/jsonata.js";
import fetch, { FetchInputs, FetchOutputs } from "./nodes/fetch.js";
import promptTemplate, {
  PromptTemplateInputs,
  PropmtTemplateOutputs,
} from "./nodes/prompt-template.js";
import urlTemplate, {
  UrlTemplateInputs,
  UrlTemplateOutputs,
} from "./nodes/url-template.js";
import runJavascript, {
  RunJavascriptInputs,
  RunJavascriptOutputs,
} from "./nodes/run-javascript.js";
import append, { AppendInputs, AppendOutputs } from "./nodes/append.js";
import secrets, { SecretInputs } from "./nodes/secrets.js";

const coreHandlers = {
  append,
  jsonata,
  secrets,
  fetch,
  urlTemplate,
  xmlToJson,
  promptTemplate,
  generateText,
  embedText,
  runJavascript,
};

/**
 * Syntactic sugar around the `coreHandlers` library.
 */
export class Starter implements Kit {
  title = "LLM Starter Kit";
  description =
    "A kit that provides a few necessary components for wiring boards that use PaLM API.";
  version = "0.0.1";
  url = "npm:@google-labs/llm-starter";

  #nodeFactory: NodeFactory;
  #handlers: NodeHandlers;

  get handlers() {
    return this.#handlers;
  }

  constructor(nodeFactory: NodeFactory) {
    this.#nodeFactory = nodeFactory;
    this.#handlers = coreHandlers;
  }

  #create<Inputs, Outputs>(
    type: NodeTypeIdentifier,
    config: OptionalIdConfiguration
  ): BreadboardNode<Inputs, Outputs> {
    const { $id, ...rest } = config;
    return this.#nodeFactory.create(this, type, rest, $id);
  }

  append<In = AppendInputs>(
    config: OptionalIdConfiguration = {}
  ): BreadboardNode<In, AppendOutputs> {
    return this.#create("append", config);
  }

  promptTemplate<In = InputValues>(
    template?: string | undefined,
    config: OptionalIdConfiguration = {}
  ): BreadboardNode<In & PromptTemplateInputs, PropmtTemplateOutputs> {
    return this.#create(
      "promptTemplate",
      template ? { template, ...config } : config
    );
  }

  urlTemplate<In = InputValues>(
    template: string,
    config: OptionalIdConfiguration = {}
  ): BreadboardNode<In & UrlTemplateInputs, UrlTemplateOutputs> {
    return this.#create("urlTemplate", { template, ...config });
  }

  runJavascript<In = InputValues, Out = RunJavascriptOutputs>(
    name: string,
    config: OptionalIdConfiguration = {}
  ): BreadboardNode<In & RunJavascriptInputs, Out> {
    return this.#create("runJavascript", { name, ...config });
  }

  fetch(
    raw?: boolean,
    config: OptionalIdConfiguration = {}
  ): BreadboardNode<FetchInputs, FetchOutputs> {
    return this.#create("fetch", { raw, ...config });
  }

  jsonata<Out = OutputValues>(
    expression: string,
    config: OptionalIdConfiguration = {}
  ): BreadboardNode<JsonataInputs, Out & JsonataOutputs> {
    return this.#create("jsonata", { expression, ...config });
  }

  xmlToJson(
    config: OptionalIdConfiguration = {}
  ): BreadboardNode<XmlToJsonInputs, XmlToJsonOutputs> {
    return this.#create("xmlToJson", config);
  }

  generateText(
    config: OptionalIdConfiguration = {}
  ): BreadboardNode<GenerateTextInputs, GenerateTextOutputs> {
    return this.#create("generateText", config);
  }

  embedText(
    config: OptionalIdConfiguration = {}
  ): BreadboardNode<EmbedTextInputs, OutputValues> {
    return this.#create("embedText", config);
  }

  secrets<Out = OutputValues>(
    keys: string[],
    config: OptionalIdConfiguration = {}
  ): BreadboardNode<SecretInputs, Out> {
    return this.#create("secrets", { keys, ...config });
  }
}
