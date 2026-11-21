import { resolveVendorIcon, type VendorIconId } from '../../../shared/vendor-icon.mjs';
import './vendor-logo.css';

const icons = import.meta.glob<string>('./vendor-icons/*.svg', { eager: true, query: '?inline', import: 'default' });

export function VendorLogo({ vendorIcon, size = 18 }: { vendorIcon?: VendorIconId | null; size?: number }) {
  const icon = resolveVendorIcon(vendorIcon ?? '');
  return <span className="vendor-logo" data-vendor-icon={icon} aria-hidden="true"
    style={{ width: size, height: size, maskImage: `url("${icons[`./vendor-icons/${icon}.svg`]}")` }} />;
}
