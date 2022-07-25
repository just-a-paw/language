<h2 align="center">Paw Bot i18n</h2>

<p align="center">
<a href="https://patreon.com/JustAPaw"><img alt="Patreon" src="https://img.shields.io/badge/patreon-donate?color=F77F6F&labelColor=F96854&logo=patreon&logoColor=ffffff"></a>
<a href="https://discord.gg/eazpsZNrRk"><img alt="Discord" src="https://img.shields.io/discord/368557500884189186?color=7389D8&labelColor=6A7EC2&logo=discord&logoColor=ffffff"></a>
<a href="https://dev.azure.com/officialpawbot/Language"><img alt="Pipeline" src="https://dev.azure.com/officialpawbot/Language/_apis/build/status/OfficialPawBot.language?branchName=main"></a>
<a href="https://crowdin.com/project/paw-bot"><img alt="Crowdin" src="https://badges.crowdin.net/paw-bot/localized.svg"></a>
</p>

## Introduction

These are the language configurations used by [Paw Bot](https://paw.bot).  
Paw Bot natively localises depending on what language Discord is set to, and can be manually configured to your preference.

## Contributing

If you would like to contribute and help translate Paw Bot, please read [Contributing](/CONTRIBUTING.md).

## As a Node.js Library

This repository contains utilities for Node.js.  
Add as a dependancy or git submodule, importing `data` provides all locales as an object.

```ts
import { en } from './language/data'

console.log(en.commands.globals.music.emptyqueue) // The queue is empty.
```

```ts
import * as locale from './language/data'

console.log(Object.keys(locale)) // [ 'en-GB', 'es-ES', 'fr', 'sv-SE' ]
```