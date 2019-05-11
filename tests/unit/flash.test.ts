import { events, flash } from '../../src/ts/flash';

test('A flash event is emitted', done => {
    events.$on('flash', () => done());

    flash('A message!', 'warning', false);
});
