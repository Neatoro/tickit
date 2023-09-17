export function h(tag, attributes = {}, children = []) {
  const element = document.createElement(tag);
  for (const attribute in attributes) {
    element.setAttribute(attribute, attributes[attribute]);
  }

  for (const child of children) {
    if (typeof child === 'string' || child instanceof String) {
      const textNode = document.createTextNode(child);
      element.appendChild(textNode);
    } else {
      element.appendChild(child);
    }
  }

  return element;
}
