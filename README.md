# ![Lang](https://cdn.statically.io/avatar/shape=circle,s=25/L) Paw Bot Languages

## Table of Contents

- [Introduction](#introduction)
- [Contributing](#contributing)
  - [Rules](#rules)
    - [Edits](#edits)
    - [Additions](#additions)
  - [Edit an existing locale](#edit-an-existing-locale)
  - [Audit your own locale](#audit-your-own-locale)
  - [Creating a pull request](#creating-a-pull-request)
  - [Example](#example)
- [Contact](#contact)

## Introduction

These are the language configurations used by [Paw Bot](https://paw.bot).  
If you would like to contribute and help translate Paw Bot, please read [Contributing](#contributing)

## Contributing

If you would like to help translate Paw Bot, or improve already translated versions, read [Edit an existing locale](#edit-an-existing-locale) or [Audit your own locale](#audit-your-own-locale).  
Don't understand these steps and want to help out? Don't worry! You can [contact us on our Discord server](#contact) or send us an email [translating@paw.bot](mailto:translating@paw.bot)

### Rules

#### Edits

- If you're editing a locale that is not English, you are not allowed to modify it beyond its English translation.
- If your edit updates an outdated translation, include `[Update]` in your PR title.
  - Outdated translations include all entries of all locales which is an update behind its English equivalent entry.
- If your edit updates the English locale, include `[Enhancement]` in your PR title and ensure to describe what you modified and the reasons why it is necessary.
- If your edit is neither an `Update` or `Enhancement`, include `[Edit]` in your PR title.

#### Additions

- If your audit is incomplete, has un-translated entries or unfished, include `[Incomplete]` in your PR title.
- If you edit is neither `Incomplete`, include `[Full Audit]` in your PR title.

### Edit an existing locale

To edit an existing locale, simply

- Enter the directory with the [ISO 639-1 code](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) and click the JSON file you want to edit.
- Click edit (the pen icon) and make your modifications.
- Once done, commit the changes and ensure you have described what you have changed and why.
- [Submit a pull request](#creating-a-pull-request) once you are satisfied with your changes.

### Audit your own locale

To add your own locale

- [Fork this repository](/fork), clone the `en` folder and rename it to your [ISO 639-1 code](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes).
- Translate all entries of each files inside your new folder.
  - Entry keys must not be modified
- [Create a pull request](#creating-a-pull-request)

### Creating a pull request

1. [Create a new pull request](/compare).
1. Compare across forks and select your repository as head, click "Create".
1. Review the modifications to ensure they are correct, click "Create".
1. Ensure the title complies with the rules, and append the name of the language you've audited or edited.
1. Fill out the template and submit.

### Example

In this example, we'll be adding a new locale.  

1. First, we're going to [fork this repository](/fork) and copy the [English `commands.json` file](https://raw.githubusercontent.com/OfficialPawBot/language/main/en/commands.json) (`cmd + a` or `ctrl + a`).
1. Find our [ISO 639-1 code](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) to use for later.
1. Go to our forked repository, click `Add file` then `Create new file`.
1. Name the file `code/commands.json` (replace `code` with the [ISO 639-1 code](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes)).  
In this example, I'm translating to Spanish, so my code will be `es`.  
![Creating the file](https://cdn.discordapp.com/attachments/645783809492779052/824847898042826762/unknown.png)
1. Paste in the English `commands.json` we just copied.
1. Translate all entries.  
![The Spanish translated entries](https://cdn.discordapp.com/attachments/645783809492779052/824849321513189396/unknown.png)
1. Name our new commit `Added translations` and click "Commit new file".
1. Repeat steps one to seven until [all English files](/tree/main/en) have been translated.  
This step is optional. If you skip it, make sure to include `[Incomplete]` in your PR title when we're finished.
1. [Now we can create a pull request so our changes can be reviewed](#creating-a-pull-request)
1. Congratulations! You've successfully audited a new locale.

## Contact

### Email us

If you would like to get in touch about translating, email us on [translating@paw.bot](mailto:translating@paw.bot).  
Unrelated to translationg? You can contact us on [support@paw.bot](mailto:translating@paw.bot).

### Discord

You can always get help from the [Discord community](https://discord.gg/KkNCFaZbDK) if we're not available.  
<a href="https://discord.gg/KkNCFaZbDK" target="_blank"><img alt="Discord" src="https://img.shields.io/discord/368557500884189186"></a>