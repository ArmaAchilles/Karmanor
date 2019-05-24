import * as fs from 'fs-extra';
import * as os from 'os';

import File from '../src/ts/file';

export default function teardown() {
    File.getAllDirectories(os.tmpdir()).forEach(dir => {
        if (dir.includes('karmanor')) {
            fs.removeSync(dir);
        }
    });
}
