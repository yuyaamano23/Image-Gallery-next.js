import { useEffect } from 'react';
import { atom, useRecoilState } from 'recoil';

const modalState = atom<boolean>({
    key: 'modalIsOpen',
    default: false,
});

export function useModalState() {
    const [modalIsOpen, setModalIsOpen] = useRecoilState(modalState);

    useEffect(() => {
        setModalIsOpen(false);
    }, []);
    return { modalIsOpen };
}
