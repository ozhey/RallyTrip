import './BackDrop.css';

const BackDrop = ({ setWindowOpen }) => {
    if (setWindowOpen) {
        return <div className='backdrop' onClick={() => setWindowOpen((prevState) => !prevState)} />;
    }
    return <div className='backdrop' />;
}

export default BackDrop;
