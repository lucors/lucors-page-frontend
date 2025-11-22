import React, { useState, useRef, useEffect } from "react";
import "./Console.css";
import { cmds } from "./shared";

const inputTemplate = "> ";
const welcomeMessage = "Введите `help` для справки.\n" + inputTemplate;

const specialKeys = [
  'Shift', 'Control', 'Alt', 'Meta', 'CapsLock',
  'Tab', 'Escape', 'ContextMenu',
  "ArrowUp", "ArrowDown", "ArrowRight", "ArrowLeft"
];


export default function Console() {
  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const [log, setLog] = useState(welcomeMessage);
  const [command, setCommand] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (!containerRef?.current) return;
    containerRef.current.scrollTop = containerRef.current.scrollHeight;
  }, [log]);

  const handleCommand = () => {
    const cmdRaw = command;
    setCommand("");
    const _log = log;
    const args = cmdRaw.trim().toLowerCase().split(" ");
    if (args[0] === "clear") {
      setLog(inputTemplate);
      return;
    }
    if (cmdRaw === "_ <") {
      setLog(_log + `\n(─‿‿─)♡\n${inputTemplate}`);
      return;
    }
    const handler = cmds.get(args[0]);
    if (!handler) {
      try {
        const f = new Function(cmdRaw);
        setLog(_log + `\n${f()}\n${inputTemplate}`);
      } catch (e) {
        setLog(_log + `\n${e}\n${inputTemplate}`);
      }
      return;
    }
    setLog(_log + `\n${handler(args.slice(1))}\n${inputTemplate}`);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleCommand();
      return;
    }
    if (event.key === "Backspace") {
      setLog(log.slice(0, -1));
      setCommand(command.slice(0, -1));
      return;
    }
    if (specialKeys.includes(event.key)) {
      return;
    }
  };

  const handleInput = (event) => {
    const e = event.nativeEvent;

    if ((e.inputType === "insertText" || e.inputType === "insertFromPaste") && e.data) {
      const text = e.data;
      setCommand(prev => prev + text);
      setLog(prev => prev + text);
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    if (e.inputType === "deleteContentBackward") {
      setCommand(prev => prev.slice(0, -1));
      setLog(prev => prev.slice(0, -1));
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const focusInput = () => {
    inputRef.current?.focus();
  };

  return (
    <div
      ref={containerRef}
      className="console-container"
      tabIndex={0}
      onClick={focusInput}
      onTouchStart={focusInput}
    >
      <pre>
        {log}
        <span className={`blinking-cursor ${isFocused}`}></span>
      </pre>

      <input
        ref={inputRef}
        className="console-hidden-input"
        value=""
        autoCorrect="off"
        autoCapitalize="none"
        spellCheck={false}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onKeyDown={handleKeyDown}
        onInput={handleInput}
      />
    </div>
  );
}
