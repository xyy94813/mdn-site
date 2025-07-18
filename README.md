# mdn-site

A repository for participating in MDN translation.

## What does this repo do?

- Use [mdn/content](https://github.com/xyy94813/content) and [mdn/translate-content](https://github.com/xyy94813/translated-content.git) as submodules.
  (_Note：I use my fork repo as submodules, you should use your own fork repo~_)
- provide some scripts for translate work
  - init_env
  - cp_files
  - add_l10n
  - ...others will todo

## Scripts

### Scripts: init_env

Init the `.env` files for "mdn/content" rpeo.

```sh
bash init_env
```

### Scripts: cp

Copy files quickly in root of this project

```sh
npm run cp ORIGIN_EN_CONTENT_SOURCE [LANG]
```

Example:

```sh
# Will copy all files in `web/api/audio_output_devices_api` to `translated-content/files/zh-cn/web/api/audio_output_devices_api`
npm run cp content/files/en-us/web/api/css_counter_styles

# You can pass the second args to select language.
npm run cp content/files/en-us/web/api/css_counter_styles fr
```

### Scripts: add_l10n

Add origin file git commit hash to translated file.

> Note: it will add commit hash again if you run many times!!!

```sh
npm run update:l10n TRANSLATED_DOC_DIR_OR_FILE
```

Example:

```sh
npm run update:l10n ./translated-content/files/zh-cn/web/api/serviceworkerglobalscope/
```

## LICENSE

[MIT](./LICENSE) RoXoM xyy94813@sina.com
