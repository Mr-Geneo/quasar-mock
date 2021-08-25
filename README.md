# Quasar App Extension mock

Intercept the simulated Axios request to complete the local API debugging function

> It seems very useful when developing front-end and back-end separation, using mockjs syntax to intercept requests

# Install

```bash
quasar ext add mock
```

Quasar CLI will retrieve it from the NPM registry and install the extension to your project.

## Prompts

> Asks whether to initialize the default instance of impersonation requests

# Uninstall

```bash
quasar ext remove mock
```

# Info

> This extension uses middleware to simulate Axios requests

# Donate

If you appreciate the work that went into this App Extension, please consider [donating to Quasar](https://donate.quasar.dev).

# Debug

```bash
yarn add --dev file:./../quasar-mock
quasar ext invoke mock
```
