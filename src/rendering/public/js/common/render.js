function decorateElement(element, attributes, children) {
  for (const attribute in attributes) {
    if (attribute.startsWith('xlink')) {
      element.setAttributeNS('', attribute, attributes[attribute]);
    } else {
      element.setAttribute(attribute, attributes[attribute]);
    }
  }

  for (const child of children) {
    if (typeof child === 'string' || child instanceof String) {
      const textNode = document.createTextNode(child);
      element.appendChild(textNode);
    } else {
      element.appendChild(child);
    }
  }
}

const namespaces = {
  svg: 'http://www.w3.org/2000/svg',
  xlink: 'http://www.w3.org/1999/xlink'
};

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
