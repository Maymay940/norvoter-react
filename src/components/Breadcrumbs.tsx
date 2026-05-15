import { Breadcrumb } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';

export const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);

  return (
    <Breadcrumb className="mt-2">
      <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/' }}>
        Главная
      </Breadcrumb.Item>
      {pathnames.map((name, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        const displayName = name === 'meter' ? 'детали' : name;
        
        return (
          <Breadcrumb.Item
            key={name}
            linkAs={isLast ? undefined : Link}
            linkProps={isLast ? undefined : { to: routeTo }}
            active={isLast}
          >
            {displayName}
          </Breadcrumb.Item>
        );
      })}
    </Breadcrumb>
  );
};