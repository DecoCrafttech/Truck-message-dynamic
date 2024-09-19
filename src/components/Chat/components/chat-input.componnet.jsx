import React, {
  forwardRef,
  useState,
  useImperativeHandle,
  useRef,
} from "react";

const ChatInput = forwardRef((props, ref) => {
  const { onEnterKey } = props;
  const inputRef = useRef(null);
  const [value, setValue] = useState("");

  useImperativeHandle(ref, () => ({
    value,
    clear: () => setValue(""),
    focus: inputRef?.current?.focus,
  }));

  const _handleOnChange = (event) => {
    setValue(event.target.value);
  };

  const _handleOnFocus = (event) => {
    const val = event?.target?.value;
    event.target.value = "";
    event.target.value = val;
  };

  const _handleOnEnterKey = (event) => {
    if (event.key === "Enter" && onEnterKey) {
      onEnterKey();
    }
  };
  
  return (
    <input
      ref={inputRef}
      placeholder="Type here..."
      className="form-control"
      style={{
        width: "100%",
        padding: "10px",
      }}
      value={value}
      onChange={_handleOnChange}
      onKeyDown={_handleOnEnterKey}
      onFocus={_handleOnFocus}
    />
  );
});

export default ChatInput;
