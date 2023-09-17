class UpdateEvent extends Event {
  constructor(keys) {
    super('update');
    this.keys = keys;
  }
}

const eventBus = new EventTarget();

class ReactiveObject {
  constructor(object, keys) {
    return new Proxy(object, {
      set: (object, prop, value) => {
        let result = false;
        if (typeof value === 'object') {
          const newReactiveObject = Store.createReactiveObject(value, [
            ...keys,
            prop
          ]);
          result = Reflect.set(object, prop, newReactiveObject);
        } else {
          result = Reflect.set(object, prop, value);
        }

        if (result) {
          eventBus.dispatchEvent(new UpdateEvent([...keys, prop]));
        }

        return result;
      }
    });
  }
}

export class Store {
  constructor(state) {
    this.state = state;
    eventBus.addEventListener('update', this._updateBindings.bind(this));

    this._bindings = [];
  }

  static initStore() {
    const state = this.createReactiveObject(window.context);
    return new Store(state);
  }

  _updateBindings(event) {
    this._bindings.forEach(({ node, key, handler }) => {
      if (this._isRelevantUpdate(event.keys, key)) {
        handler({ node, state: this.state });
      }
    });
  }

  _isRelevantUpdate(updatedKey, key) {
    return key
      .split('.')
      .reduce((acc, value, index) => acc || updatedKey[index] === value, false);
  }

  addBinding(domNode, key, handler) {
    this._bindings.push({
      node: domNode,
      key,
      handler
    });
  }

  static createReactiveObject(object, parentKeys = []) {
    const newObject = typeof object.length === 'number' ? [] : {};

    const keys = Object.keys(object);
    for (const key of keys) {
      if (typeof object[key] === 'object') {
        newObject[key] = Store.createReactiveObject(object[key], [
          ...parentKeys,
          key
        ]);
      } else {
        newObject[key] = object[key];
      }
    }

    return new ReactiveObject(newObject, parentKeys);
  }
}
