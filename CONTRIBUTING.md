# Contributing

[miscellaneous localisation]: #miscellaneous-localisation
[crowdin]: https://crowdin.com/project/paw-bot

## Scope

This repository's purpose is

* CI/CD;
* maintaining the source locale;
* providing and maintaining miscellaneous locale;
* providing these locales as a Node.js library

and not

* providing, maintaining or discussing locale provided by Discord, this is done via [Crowdin].

## Crowdin localisation

All 30 locales provided by Discord (exluding below) are localised on [Crowdin].  
If your locale isn't on Crowdin, see [miscellaneous localisation].  

The following are not localised on Crowdin, see [miscellaneous localisation]:

* Croatian;
* Hindi;
* Thai;
* Chinese, Taiwan.

## Miscellaneous localisation

Add your locale the manual way if it's not on [Crowdin].

### Prerequisites

* [Node.js](https://nodejs.org/) version 12 or higher is needed to lint and test.  
* [Git command-line tools](https://git-scm.com/downloads).

### Steps

[Fork this repository](/../../fork).  

`git clone` your fork.  

Run `npm ci` inside the folder.  

Copy the source locale folder `en-GB` to a folder with the name of your locale's correct [IEFT BCP 47 / RFC 5646](https://developer.crowdin.com/language-codes/) language tag.  

Localise the contents of your locale's folder (not `en-GB`!) from English to your locale using the editor of your choice.  
`locale.json` is a config file that does not need to be translated. Simply add yourself to `contributors` and remove everyone else.  

Once satisfied, run the following without errors:  

```sh-connection
npm run lint:fix
npm run test
```

Create your branch, commit your changes and push. Replace `bcp` with your [IEFT BCP 47 / RFC 5646](https://developer.crowdin.com/language-codes/) code:  

```sh-connection
git switch -c feat/bcp
git commit -m 'feat(bcp): add translation'
git push -u origin HEAD
```

Submit a [pull request](/../../compare).  

Profit.
