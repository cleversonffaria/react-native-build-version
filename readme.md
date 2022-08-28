**Por favor, crie um pull request para o projeto se você melhorar alguma coisa!**
**Isso nos ajudará a criar juntos um pacote de alta qualidade.**

Esse projeto foi modificado por [Cleverson Fernandes](https://github.com/cleversonffaria), porem créditos de desenvolvimento para: [gustarus](https://github.com/gustarus/rn-update-build-version)

# React native version upper

Aumente`major`, `minor` ou `patch` da versão e do número da compilação em seu aplicativo em package.json e em projetos ios e android com um comando.

```
node ./node_modules/rn-update-build-version/index.js --patch -m 'commit message'
```

Com este script você pode:

- Increase `major`, `minor` or `patch` part in the version.
- Make a git commit with version changes.
- Make a git tag with new version.

## Exemplo

```bash
> yarn run version:up -- --patch
$ rn-update-build-version "--patch"

I'm going to increase the version in:
  - package.json (./package.json);
  - ios project (./ios/happinesstracker/Info.plist);
  - android project (./android/app/build.gradle).

The version will be changed:
  - from: 0.2.2 (9);
  - to:   0.2.3 (10).

Use "0.2.3" as the next version? [y/n] y

Atualizando versões
    Atualizando versão em package.json...
  Versão no package.json alterada.
    Atualizando versão no projeto xcode...
  Versão e número de compilação no projeto ios (arquivo plist) alterados.
    Atualizando versão no projeto android...
  Versão e número de compilação no projeto android (arquivo gradle) alterados.

Feito!
```

## Instalação

```
yarn add rn-update-build-version
```

Or via npm:

```
npm install rn-update-build-version --save
```

## Uso

**1. Adicione o comando na seção `scripts` em `package.json`**

```json
{
  "name": "your-project-name",
  "scripts": {
    "version:patch": "node ./node_modules/rn-update-build-version/index.js --patch",
    "version:major": "node ./node_modules/rn-update-build-version/index.js --major",
    "version:minor": "node ./node_modules/rn-update-build-version/index.js --minor"
  }
}
```

**2. Certifique-se de ter definido a versão**

```json
{
  "name": "your-project-name",
  "version": "1.0.0",
  "scripts": {
    "version:patch": "node ./node_modules/rn-update-build-version/index.js --patch",
    "version:major": "node ./node_modules/rn-update-build-version/index.js --major",
    "version:minor": "node ./node_modules/rn-update-build-version/index.js --minor"
  }
}
```

**3. Confirme o package.json (opcional)**

```bash
git add package.json
git commit -m 'version:up command added'
```

**4. Aumente a versão quando necessário**

```bash
yarn version:up --major
```

Or via npm:

```bash
npm run version:up -- --major
```

## Options

Você pode passar o nome e o valor da opção com a seguinte sintaxe (lembre-se de colocar `--` antes das opções se estiver usando npm, com yarn isso não é necessário):

```
yarn version:up --flag value
```

| **Option**                     | **Type** | **Default value**                                           | **Description**                                      |
| ------------------------------ | -------- | ----------------------------------------------------------- | ---------------------------------------------------- |
| **`--major`**                  | `flag`   |                                                             | Increase `major` version:<br/>**0**.0.0 -> **1**.0.0 |
| **`--minor`**                  | `flag`   |                                                             | Increase `minor` version:<br/>0.**0**.0 -> 0.**1**.0 |
| **`--patch`**                  | `flag`   |                                                             | Increase `patch` version:<br/>0.0.**0** -> 0.0.**1** |
| **`--message` or `-m`**        | `string` | `"release ${version}: increase versions and build numbers"` | Custom commit message.                               |
| **`--pathToPackage './path'`** | `string` | `./package.json`                                            | Path to `package.json` file in your project.         |
| **`--pathToPlist './path'`**   | `string` | `./ios/${package.name}/Info.plist`                          | Path to `Info.plist` file (ios project).             |
| **`--pathToGradle './path'`**  | `string` | `./android/app/build.gradle`                                | Path to `build.gradle` file (android project).       |
