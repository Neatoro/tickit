export function h(tag, attributes = {}, children = []) {
  const element = document.createElement(tag);
  Object.keys(attributes)
    .filter((attribute) => attributes[attribute])
    .forEach((attribute) => {
      element.setAttribute(attribute, attributes[attribute]);
    });

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

export function createIcon(iconName) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.classList.add('icon');

  const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
  svg.appendChild(use);

  use.setAttributeNS(
    'http://www.w3.org/1999/xlink',
    'xlink:href',
    `/icons/icons.svg#${iconName}`
  );

  return svg;
}
