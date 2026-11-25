import test from 'node:test';
import assert from 'node:assert/strict';
import {
  BUSINESS_ADDRESS,
  SERVICES,
  WHATSAPP_DEFAULT_MESSAGE,
  WHATSAPP_PHONE_DIGITS,
  buildGoogleMapsDirectionsUrl,
  buildWhatsAppUrl,
  clampInspectionCoordinates,
  clampSliderPercentage,
  computePointerParallax,
  stepInspectionCoordinates,
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

test('SERVICES contains exclusively the 5 specified services without unconfirmed commercial text', () => {
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
  for (const service of SERVICES) {
    assert.ok(!/R\$|garantia|promoç|desconto|combo|pacote/i.test(service.description));
  }
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

test('clampInspectionCoordinates clamps pointer coordinates cleanly inside paint inspection zone', () => {
  assert.deepEqual(clampInspectionCoordinates(200, 150, 100, 50, 200, 200), { x: 50, y: 50 });
  assert.deepEqual(clampInspectionCoordinates(90, 40, 100, 50, 200, 200), { x: 6, y: 10 });
  assert.deepEqual(clampInspectionCoordinates(350, 300, 100, 50, 200, 200), { x: 94, y: 90 });
  assert.deepEqual(clampInspectionCoordinates(150, 150, 0, 0, 0, 100), { x: 50, y: 50 });
});

test('stepInspectionCoordinates moves inspection beam across 4 directions and resets on Home', () => {
  assert.deepEqual(stepInspectionCoordinates({ x: 50, y: 50 }, 'ArrowLeft', 10), { x: 40, y: 50 });
  assert.deepEqual(stepInspectionCoordinates({ x: 50, y: 50 }, 'ArrowRight', 10), { x: 60, y: 50 });
  assert.deepEqual(stepInspectionCoordinates({ x: 50, y: 50 }, 'ArrowUp', 10), { x: 50, y: 40 });
  assert.deepEqual(stepInspectionCoordinates({ x: 50, y: 50 }, 'ArrowDown', 10), { x: 50, y: 60 });
  assert.deepEqual(stepInspectionCoordinates({ x: 8, y: 12 }, 'ArrowLeft', 10), { x: 6, y: 12 });
  assert.deepEqual(stepInspectionCoordinates({ x: 80, y: 20 }, 'Home'), { x: 50, y: 50 });
});

test('computePointerParallax bounds offsets within maxOffset', () => {
  assert.deepEqual(computePointerParallax(500, 500, 1000, 1000, 14), { x: 0, y: 0 });
  assert.deepEqual(computePointerParallax(1000, 0, 1000, 1000, 14), { x: 14, y: -14 });
  assert.deepEqual(computePointerParallax(-100, 1500, 1000, 1000, 14), { x: -14, y: 14 });
  assert.deepEqual(computePointerParallax(100, 100, 0, 0, 14), { x: 0, y: 0 });
});
