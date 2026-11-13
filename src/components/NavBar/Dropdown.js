import DropdownItem from './DropdownItem';
import { links } from '../../links';
import './Dropdown.css';

const Dropdown = () => {
    return (
        <ul className='dropdown'>
            {links.map(link => <DropdownItem key={link.path} path={link.path} label={link.name} routes={link.routes} />)}
        </ul>
    );
}

export default Dropdown;
