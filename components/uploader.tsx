import React, { FC, useCallback, useState } from 'react';
import Image from 'next/image';
import { useDropzone } from 'react-dropzone';
import firebase from 'firebase/app';
import { storage } from 'lib/firebase';
import { useAuthentication } from 'hooks/authentication';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Button,
    FormControl,
    FormLabel,
    Input,
} from '@chakra-ui/react';

export type firebaseOnLoadProp = {
    bytesTransferred: number;
    totalBytes: number;
    state: firebase.storage.TaskState;
    // このほかにもmetadata,task,refがある
};

const Uploader: FC = () => {
    const [myFiles, setMyFiles] = useState<File[]>([]);
    const [clickable, setClickable] = useState(false);
    const [src, setSrc] = useState('');
    const [title, setTitle] = useState<string>('default');
    const { user } = useAuthentication();

    // chakraのmodal
    const { isOpen, onOpen, onClose } = useDisclosure();
    const initialRef = React.useRef();
    const finalRef = React.useRef();

    // recoil
    const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        if (!acceptedFiles[0]) return;

        try {
            setMyFiles([...acceptedFiles]);
            setClickable(true);
            handlePreview(acceptedFiles);
        } catch (error) {
            alert(error);
        }
    }, []);

    const onDropRejected = () => {
        alert('画像のみ受け付けることができます。');
    };

    const { getRootProps, getInputProps } = useDropzone({
        accept: ['image/*'],
        onDrop,
        onDropRejected,
    });

    const handleUpload = (accepterdImg: any) => {
        try {
            // アップロード処理
            const uploadTask: any = storage
                .ref(`/images/${myFiles[0].name}`)
                .put(myFiles[0]);

            uploadTask.on(
                firebase.storage.TaskEvent.STATE_CHANGED,
                function (snapshot: firebaseOnLoadProp) {
                    const progress: number =
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log('Upload is ' + progress + '% done');
                    switch (snapshot.state) {
                        case firebase.storage.TaskState.PAUSED: // or 'paused'
                            console.log('Upload is paused');
                            break;
                        case firebase.storage.TaskState.RUNNING: // or 'running'
                            console.log('Upload is running');
                            break;
                    }
                },
                function (error: any) {
                    // 失敗した時
                    switch (error.code) {
                        case 'storage/unauthorized':
                            // User doesn't have permission to access the object
                            console.error('許可がありません');
                            break;

                        case 'storage/canceled':
                            console.error(
                                'アップロードがキャンセルされました　'
                            );
                            // User canceled the upload
                            break;

                        case 'storage/unknown':
                            console.error('予期せぬエラーが発生しました');
                            // Unknown error occurred, inspect error.serverResponse
                            break;
                    }
                },
                function () {
                    // 成功した時
                    try {
                        uploadTask.snapshot.ref
                            .getDownloadURL()
                            .then(function (downloadURL: string) {
                                console.log(
                                    'ダウンロードしたURL' + downloadURL
                                );
                                // 画像のstorageへの保存と同時にstoreへ保存
                                firebase
                                    .firestore()
                                    .collection('posts')
                                    .doc()
                                    .set({
                                        downloadUrl: downloadURL,
                                        createdAt: new Date(),
                                        userId: user.uid,
                                        title: title,
                                    });
                                console.log('画像がdbに保存されました');
                            });
                    } catch (error) {
                        switch (error.code) {
                            case 'storage/object-not-found':
                                console.log('ファイルが存在しませんでした');
                                break;
                            case 'storage/unauthorized':
                                console.log('許可がありません');
                                break;
                            case 'storage/canceled':
                                console.log('キャンセルされました');
                                break;
                            case 'storage/unknown':
                                console.log('予期せぬエラーが生じました');
                                break;
                        }
                    }
                }
            );
        } catch (error) {
            console.log('エラーキャッチ', error);
        }
        setSrc('');
    };

    const handlePreview = (files: any) => {
        if (files === null) {
            return;
        }
        const file = files[0];
        if (file === null) {
            return;
        }
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            setSrc(reader.result as string);
        };
    };
    return (
        <React.Fragment>
            <Button
                onClick={() => setModalIsOpen(!modalIsOpen)}
                bgColor="tomato"
            >
                open modal
            </Button>

            <Modal
                initialFocusRef={initialRef}
                finalFocusRef={finalRef}
                isOpen={modalIsOpen}
                onClose={() => setModalIsOpen(!modalIsOpen)}
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Create your account</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <div
                            className="bg-gray-200 border-2 border-gray-500 rounded-md"
                            style={{ height: '350px' }}
                            {...getRootProps()}
                        >
                            {/* この中をタップすれば画像を選択できる */}
                            <input
                                {...getInputProps()}
                                style={{ height: '40px' }}
                            />
                            {myFiles.length === 0 ? (
                                <p className="py-4 text-center">
                                    画像を選択またはドラッグ＆ドロップできます
                                </p>
                            ) : (
                                <div>
                                    {myFiles.map((file: File) => (
                                        <div
                                            key={file.name}
                                            className="text-center"
                                        >
                                            {src && (
                                                <Image
                                                    src={src}
                                                    width={200}
                                                    height={200}
                                                    objectFit="contain"
                                                    alt={file.name}
                                                />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <FormControl>
                            <FormLabel>タイトル：</FormLabel>
                            <Input
                                onChange={(e) => setTitle(e.target.value)}
                                ref={initialRef}
                                placeholder="title"
                            />
                        </FormControl>
                    </ModalBody>

                    <ModalFooter>
                        <Button
                            colorScheme="blue"
                            mr={3}
                            disabled={!clickable}
                            onClick={() => handleUpload(myFiles)}
                            type="submit"
                        >
                            Upload
                        </Button>
                        <Button onClick={() => setModalIsOpen(!modalIsOpen)}>
                            Cancel
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </React.Fragment>
    );
};
export default Uploader;
