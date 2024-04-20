# mdn-site

A repository for participating in MDN translation.

## What does this repo do?

- Use [mdn/content](https://github.com/xyy94813/content) and [mdn/translate-content](https://github.com/xyy94813/translated-content.git) as submodules.
  (_Note：I use my fork repo as submodules, you should use your own fork repo~_)
- provide some scripts for translate work
  - init_env
  - cp_files
  - ...others will todo

## Scripts

### Scripts: init_env

Init the `.env` files for "mdn/content" rpeo.

```sh
bash init_env
```

### Scripts: cp_files

Copy files quickly in root of this project

```sh
bash cp_files ORIGIN_EN_CONTENT_SOURCE [LANG]
```

Example:

```sh
# Will copy all files in `web/api/audio_output_devices_api` to `translated-content/files/zh-cn/web/api/audio_output_devices_api`
bash cp_files ./content/files/en-us/web/api/audio_output_devices_api

# You can pass the seccond args to select language.
bash cp_files ./content/files/en-us/web/api/audio_output_devices_api fr
```

## LICENSE

[MIT](./LICENSE) RoXoM xyy94813@sina.com
