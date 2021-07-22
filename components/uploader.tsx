import React, { FC, useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { useDropzone } from 'react-dropzone';
import firebase from 'firebase/app';
import 'firebase/storage';
import { storage } from 'lib/firebase';

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
        <div>
            <div className="w-4/5 px-4 py-2 mx-auto my-4 text-center rounded-md">
                <div
                    className="bg-gray-200 border-2 border-gray-500 rounded-md"
                    {...getRootProps()}
                >
                    {/* この中をタップすれば画像を選択できる */}
                    <input {...getInputProps()} />
                    {myFiles.length === 0 ? (
                        <p className="py-4">
                            画像を選択またはドラッグ＆ドロップできます
                        </p>
                    ) : (
                        <div>
                            {myFiles.map((file: File) => (
                                <React.Fragment key={file.name}>
                                    {src && (
                                        <Image
                                            src={src}
                                            width={200}
                                            height={200}
                                            alt={file.name}
                                        />
                                    )}
                                </React.Fragment>
                            ))}
                        </div>
                    )}
                </div>
                <button
                    disabled={!clickable}
                    type="submit"
                    className="px-4 py-2 my-4 bg-gray-200 rounded-md"
                    onClick={() => handleUpload(myFiles)}
                >
                    UPLOAD
                </button>
            </div>
        </div>
    );
};
export default Uploader;
