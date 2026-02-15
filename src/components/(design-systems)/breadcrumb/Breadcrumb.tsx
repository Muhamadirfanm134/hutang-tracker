import { ChevronRightIcon } from '@heroicons/react/16/solid';
import Link from 'next/link';

interface BreadcrumbProps {
  items: { label: string; href: string }[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex space-x-1">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <ChevronRightIcon
                width={24}
                className="text-(--color-grey-300)"
              />
            )}
            <Link
              href={item.href}
              className={`text-sm font-medium max-md:text-xs ${
                index === 0
                  ? 'font-semibold text-(--color-primary-500) uppercase'
                  : 'text-gray-700'
              } hover:text-gray-900`}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
