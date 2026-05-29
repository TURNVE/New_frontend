import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const configs = fs.readFileSync(path.join(root, 'src/features/sim-pm-fintech-track/configs.ts'), 'utf8');
const registry = fs.readFileSync(path.join(root, 'src/features/simulations/index.ts'), 'utf8');
const router = fs.readFileSync(path.join(root, 'src/router.tsx'), 'utf8');

const expectedIds = Array.from({ length: 10 }, (_, index) => `sim-pm-fintech-${String(index + 1).padStart(3, '0')}`);
const missingConfigIds = expectedIds.filter((id) => !configs.includes(`id: '${id}'`));
const registryUsesFintechArray = registry.includes('FINTECH_PM_SIMULATIONS') && registry.includes('...FINTECH_PM_REGISTRY');
const missingRegistryIds = registryUsesFintechArray ? [] : expectedIds.filter((id) => !registry.includes(`'${id}'`));
const missingExports = [
  'TRADEPAY_MERCHANT_ONBOARDING_CONFIG',
  'FUNDLY_WALLET_FUNDING_CONFIG',
  'BILLMATE_BILL_PAYMENT_CONFIG',
  'CREDITEASE_LOAN_APPLICATION_CONFIG',
  'SAFEPAY_FRAUD_ALERT_CONFIG',
  'SAVEWISE_SAVINGS_ACTIVATION_CONFIG',
  'HELPPAY_SUPPORT_SELF_SERVICE_CONFIG',
].filter((name) => !configs.includes(name));

const hasGenericRegisteredRoute = router.includes('RegisteredSimulationRoute')
  && router.includes('path="/simulation/:simulationId/*"');

const failures = [
  missingConfigIds.length ? `Missing fintech config ids: ${missingConfigIds.join(', ')}` : '',
  missingRegistryIds.length ? `Missing registry ids: ${missingRegistryIds.join(', ')}` : '',
  !registryUsesFintechArray ? 'Registry is not using FINTECH_PM_SIMULATIONS as the fintech source of truth' : '',
  missingExports.length ? `Missing config exports: ${missingExports.join(', ')}` : '',
  !hasGenericRegisteredRoute ? 'Missing generic registered simulation route' : '',
].filter(Boolean);

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log('fintech simulation library checks passed');
