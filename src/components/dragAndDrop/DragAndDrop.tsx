import React, {Component} from 'react';
import './DragAndDrop.scss';
import DragAndDropImage from './DragAndDropImage.png';
import {Typography} from "@material-ui/core";
import {ReactComponent as FileIcon} from '../../assets/icons/evericons/file.svg';
import {ReactComponent as TimesIcon} from '../../assets/icons/evericons/x.svg';
import { Color } from '../../styles/theme';
import ActionButton, {ButtonVariant} from '../actionButton/ActionButton';
import {connect} from 'react-redux';
import {importJSON} from '../../app/eventCreatorSlice';

interface DragAndDropState {
    validFiles: Array<File>;
    invalidFiles: Array<File>;
    validFileTypes: Array<string>;
    validFileTypesString: Array<string>;
}

interface DragAndDropProps {
    maxFiles?: number;
    validFileTypes?: Array<string>;
    importJSON: (files: any) => void;
}


class DragAndDrop extends Component<DragAndDropProps, DragAndDropState> {

    constructor(props: DragAndDropProps) {
        super(props);
        this.state = {
            invalidFiles: [],
            validFiles: [],
            validFileTypes: this.props.validFileTypes || ['image/jpeg', 'image/jpg', 'image/png'],
            validFileTypesString: [],
        }
    }

    componentDidMount(): void {
        const validFileTypesString: Array<string> = this.state.validFileTypes.map((value: string) => value.match("[^/]+$")![0]);
        this.setState({validFileTypesString});
    }

    private dragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    private dragEnter = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    private dragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    private fileDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const files = e.dataTransfer?.files;
        if (files.length) {
            this.handleFiles(files);
        }
    };

    private handleFiles(files: FileList) {
        for (let i = 0; i < files.length; i++) {
            if (this.checkFile(files[i])) {
                const newValidFiles = this.state.validFiles;
                newValidFiles.push(files[i]);
                this.setState({validFiles: newValidFiles});
            } else {
                const newInvalidFiles = this.state.invalidFiles;
                newInvalidFiles.push(files[i]);
                this.setState({invalidFiles: newInvalidFiles});
            }
        }
    }

    private checkFile = (file: File) => {
        const validTypes = this.props.validFileTypes || this.state.validFileTypes;
        //return validTypes.indexOf(file.type) !== -1;
        return true;
    };

    private fileSize = (size: number) => {
        if (size === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(size) / Math.log(k));
        return parseFloat((size / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    private removeFile = (index: number) => {
        const newValidFiles = this.state.validFiles;
        newValidFiles.splice(index, 1);
        this.setState({validFiles: newValidFiles});
    };

    private filesSelected = (event: any) => {
        this.handleFiles(event.target.files);
    };

    private uploadFiles = () => {
        console.log('hello', this.props);
        this.props.importJSON(this.state.validFiles);
    };

    render() {

        return (
            <div className="DragAndDropContainer">
                <div className="DragAndDropRow">
                    <div
                        draggable={true}
                        className={'DragAndDropBox'}
                        onDragOver={this.dragOver}
                        onDragEnter={this.dragEnter}
                        onDragLeave={this.dragLeave}
                        onDrop={this.fileDrop}>
                        <Typography variant="h2">Arrastra aquí tus documentos o
                            <span className={'primary'}> explora en tus carpetas</span>
                        </Typography>
                        <br/>
                        <div>
                            <Typography variant="subtitle1" display={'inline'}>Los formatos soportados son </Typography>
                            {this.state.validFileTypesString.map((type: string, i) => {
                                return <Typography variant="subtitle1" display={'inline'} key={i}>.{type} </Typography>
                            })}
                        </div>
                        <img src={DragAndDropImage} alt="DragAndDropImage"/>
                        <input type="file" multiple onChange={this.filesSelected} className="DragAndDropFileInput"/>
                    </div>
                    {this.state.validFiles.length ?
                        <Typography variant="body2"
                                    display={'block'}
                                    className={'DragAndDropFilesTitle'}>Archivos a subir</Typography>
                        : null}
                    {this.state.validFiles.length ? this.state.validFiles.map((file: File, i) => {
                        return (<div key={i} className={'DragAndDropValidFiles'}>
                            <FileIcon/>
                            <Typography variant="subtitle1" display="inline" color='textPrimary'>{file.name}</Typography>
                            <Typography variant="subtitle1" display="inline" color='textPrimary'>{this.fileSize(file.size)}</Typography>
                            <TimesIcon className={'DragAndDropRemoveFileIcon'} onClick={() => this.removeFile(i)}/>
                            <br/>
                        </div>)
                    }) : null}
                    {this.state.invalidFiles.length && this.state.validFiles.length ? <hr/> : null}
                    {this.state.invalidFiles.length ?
                        <Typography variant="body2"
                                    display={'block'}
                                    className={'DragAndDropFilesTitle'}>Archivos que no se subirán</Typography>
                        : null}
                    {this.state.invalidFiles.length ? this.state.invalidFiles.map((file: File, i) => {
                        return (<div key={i} className={'DragAndDropInvalidFiles'}>
                            <FileIcon/>
                            <Typography variant="subtitle1" display="inline" color='textPrimary'>{file.name}</Typography>
                            <Typography variant="subtitle1" display="inline" color='textPrimary'>{this.fileSize(file.size)}</Typography>
                            <Typography variant="subtitle1" display="inline" color={"error"}>Tipo de archivo no
                                permitido</Typography>
                        </div>)
                    }) : null}
                    {this.state.validFiles.length ?
                        <ActionButton innerText={"Subir archivos"}
                                      color={Color.PRIMARY}
                                      variant={ButtonVariant.CONTAINED}
                                      onClick={this.uploadFiles}
                                      className={'DragAndDropUploadButton'}/> : null
                    }
                </div>
            </div>
        );
    }
}
const mapStateToProps = () => {
    return {};
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        importJSON: (files: any) => dispatch(importJSON(files))
    }
};
export default connect(mapStateToProps, mapDispatchToProps)(DragAndDrop);

