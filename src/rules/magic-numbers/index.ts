import stylelint from 'stylelint';
import * as meta from './meta';
import { magicNumbers } from './rule';

export default stylelint.createPlugin(meta.name, magicNumbers);
