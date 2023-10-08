function createProxy(elements, object = window.context, parentKeys = []) {
  const newObject = typeof object.length === 'number' ? [] : {};

  const keys = Object.keys(object);
  for (const key of keys) {
    if (typeof object[key] === 'object') {
      newObject[key] = createProxy(elements, object[key], [...parentKeys, key]);
    } else {
      newObject[key] = object[key];
    }
  }

  return new Proxy(newObject, {
    set(object, prop, value) {
      let result = false;
      if (typeof value === 'object') {
        result = Reflect.set(
          object,
          prop,
          createProxy(elements, value, [...parentKeys, prop])
        );
      } else {
        result = Reflect.set(...arguments);
      }

      Object.values(elements).forEach((element) =>
        element.update([...parentKeys, prop])
      );

      return result;
    }
  });
}

export function setupBindingModule() {
  const elements = createElements();
  return {
    elements,
    context: createProxy(elements)
  };
}

export function createElements() {
  const domNodes = document.querySelectorAll('[data-bind][data-id]');
  return [...domNodes]
    .map((domNode) => new Element(domNode))
    .reduce(
      (acc, element) => ({
        ...acc,
        [element.dom.getAttribute('data-id')]: element
      }),
      {}
    );
}

export class Element {
  constructor(domNode) {
    this.dom = domNode;
    this.updates = [];
  }

  addUpdate(key, update) {
    this.updates.push({
      key,
      update
    });
  }

  update(updatedKey) {
    this.updates.forEach(({ key, update }) => {
      if (this._isRelevantUpdate(updatedKey, key)) {
        update.bind(this)();
      }
    });
  }

  _isRelevantUpdate(updatedKey, key) {
    return key
      .split('.')
      .reduce((acc, value, index) => acc || updatedKey[index] === value, false);
  }
}
