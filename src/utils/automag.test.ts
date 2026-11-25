import test from 'node:test';
import assert from 'node:assert/strict';
import {
  BUSINESS_ADDRESS,
  SERVICES,
  WHATSAPP_DEFAULT_MESSAGE,
  WHATSAPP_PHONE_DIGITS,
  buildGoogleMapsDirectionsUrl,
  buildWhatsAppUrl,
  clampSliderPercentage,
  computePointerParallax,
  stepSliderPercentage,
} from './automag';

test('buildWhatsAppUrl formats exact phone number and pre-filled message', () => {
  const url = buildWhatsAppUrl();
  assert.ok(url.startsWith(`https://wa.me/${WHATSAPP_PHONE_DIGITS}?text=`));
  const parsed = new URL(url);
  assert.equal(parsed.searchParams.get('text'), WHATSAPP_DEFAULT_MESSAGE);
});

test('buildGoogleMapsDirectionsUrl encodes exact business address', () => {
  const url = buildGoogleMapsDirectionsUrl();
  const parsed = new URL(url);
  assert.equal(parsed.origin, 'https://www.google.com');
  assert.equal(parsed.pathname, '/maps/dir/');
  assert.equal(parsed.searchParams.get('api'), '1');
  assert.equal(parsed.searchParams.get('destination'), BUSINESS_ADDRESS);
});

test('SERVICES contains exclusively the 5 specified services', () => {
  assert.equal(SERVICES.length, 5);
  assert.deepEqual(
    SERVICES.map((s) => s.title),
    [
      'Lavagem simples',
      'Lavagem completa',
      'Lavagem com cera',
      'Higienização de bancos',
      'Polimentos',
    ]
  );
});

test('clampSliderPercentage clamps values between 0 and 100 and handles invalid rects', () => {
  assert.equal(clampSliderPercentage(150, 100, 200), 25);
  assert.equal(clampSliderPercentage(50, 100, 200), 0);
  assert.equal(clampSliderPercentage(400, 100, 200), 100);
  assert.equal(clampSliderPercentage(150, 100, 0), 50);
});

test('stepSliderPercentage supports keyboard arrow, Home, and End navigation', () => {
  assert.equal(stepSliderPercentage(50, 'ArrowLeft'), 45);
  assert.equal(stepSliderPercentage(50, 'ArrowRight'), 55);
  assert.equal(stepSliderPercentage(2, 'ArrowLeft'), 0);
  assert.equal(stepSliderPercentage(98, 'ArrowRight'), 100);
  assert.equal(stepSliderPercentage(42, 'Home'), 0);
  assert.equal(stepSliderPercentage(42, 'End'), 100);
  assert.equal(stepSliderPercentage(42, 'Enter'), 42);
});

test('computePointerParallax bounds offsets within maxOffset', () => {
  assert.deepEqual(computePointerParallax(500, 500, 1000, 1000, 14), { x: 0, y: 0 });
  assert.deepEqual(computePointerParallax(1000, 0, 1000, 1000, 14), { x: 14, y: -14 });
  assert.deepEqual(computePointerParallax(-100, 1500, 1000, 1000, 14), { x: -14, y: 14 });
  assert.deepEqual(computePointerParallax(100, 100, 0, 0, 14), { x: 0, y: 0 });
});
