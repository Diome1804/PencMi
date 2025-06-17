export function createElement(tag, className = '', textContent = '') {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (textContent) element.textContent = textContent;
  return element;
}

export function createInput(type, placeholder, className) {
  const input = createElement('input', className);
  input.type = type;
  input.placeholder = placeholder;
  return input;
}

export function createButton(text, className, type = 'button') {
  const button = createElement('button', className, text);
  button.type = type;
  return button;
}
