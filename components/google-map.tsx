import { formatAddress, pizzeria } from '../content/pizzeria';
import { mapEmbedUrl } from '../lib/maps';

/**
 * Google Maps embed for the pizzeria's address. Lazy-loaded, so pages only contact Google when
 * the map scrolls into view. Dark mode softens the map with --map-filter (tailwind.input.css).
 */
export function GoogleMap({ className = '' }: { className?: string }) {
  return (
    <div className={`map ${className}`}>
      <iframe
        src={mapEmbedUrl(formatAddress())}
        title={`Map showing ${pizzeria.name} at ${formatAddress()}`}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
    </div>
  );
}
