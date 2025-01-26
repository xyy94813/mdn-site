#!/usr/bin/env node
import { Command } from 'commander';

const program = new Command();

program
  .command('copy')
  .argument('<source>', 'origin content path')
  .option('-l, --lang <string>', 'target lang', "zh-cn")
  .description('clone origin content to translated-content, default to zh-cn')
  .alias('cp')
  .action((source, { lang }) => {
    import('./copy.mjs').then(({ default: copy }) => {
      copy(source, lang)
    })
  })

program
  .command('update-l10n')
  .argument('<source>', 'translated content path')
  .alias('l10n')
  .action((source,) => {
    import('./update-l10n.mjs').then(({ default: updateL10n }) => {
      updateL10n(source)
    })
  })

program.parse();
