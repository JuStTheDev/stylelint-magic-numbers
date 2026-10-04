import stylelint from 'stylelint';
import * as meta from './meta';
import { magicColors } from './rule';

export default stylelint.createPlugin(meta.name, magicColors);
