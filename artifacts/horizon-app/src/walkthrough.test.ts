import assert from 'node:assert/strict';
import test from 'node:test';
import {
  demoReducer,
  distressScoreForFlow,
  initialDemoState,
  type DemoState,
} from './walkthrough.ts';

test('the judge walkthrough completes the happy path and resets', () => {
  let state: DemoState = initialDemoState;

  state = demoReducer(state, { type: 'launch-upi' });
  assert.equal(state.flow, 'pending');
  assert.equal(distressScoreForFlow(state.flow), 68);

  state = demoReducer(state, { type: 'approve-guardian' });
  assert.equal(state.flow, 'approved');
  assert.equal(distressScoreForFlow(state.flow), 34);

  state = demoReducer(state, { type: 'resolve-collision' });
  state = demoReducer(state, { type: 'pause-zombie' });
  assert.equal(state.collisionResolved, true);
  assert.equal(state.zombiePaused, true);

  const changedState = demoReducer(state, { type: 'add-microsave' });
  assert.equal(changedState.saved, 3000);

  state = demoReducer(changedState, { type: 'reset' });
  assert.deepEqual(state, initialDemoState);
  assert.equal(distressScoreForFlow(state.flow), 68);
});

test('guardian denial stays distinct and can be reviewed again', () => {
  let state = demoReducer(initialDemoState, { type: 'launch-upi' });

  state = demoReducer(state, { type: 'deny-guardian' });
  assert.equal(state.flow, 'denied');
  assert.notEqual(state.flow, 'approved');
  assert.equal(distressScoreForFlow(state.flow), 68);

  state = demoReducer(state, { type: 'restart-upi' });
  assert.equal(state.flow, 'idle');
  assert.deepEqual(state, initialDemoState);
});