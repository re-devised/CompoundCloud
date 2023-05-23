<template>
  <div v-html="setIcon()" class="file_icon" :class="[size, color]"/>
</template>

<script>
    import file from "~/static/bootstrap-icons/file-earmark.svg?raw";
    import file_code from "~/static/bootstrap-icons/file-earmark-code.svg?raw";
    import file_image from "~/static/bootstrap-icons/file-earmark-image.svg?raw";
    import file_lock from "~/static/bootstrap-icons/file-earmark-lock.svg?raw";
    import file_music from "~/static/bootstrap-icons/file-earmark-music.svg?raw";
    import file_movie from "~/static/bootstrap-icons/file-earmark-play.svg?raw";
    import file_zip from "~/static/bootstrap-icons/file-earmark-zip.svg?raw";
    import file_text from "~/static/bootstrap-icons/file-earmark-text.svg?raw";
    import file_font from "~/static/bootstrap-icons/file-earmark-font.svg?raw";
    import file_table from "~/static/bootstrap-icons/file-earmark-spreadsheet.svg?raw";
    import file_presentation from "~/static/bootstrap-icons/file-earmark-slides.svg?raw";
    import file_exe from "~/static/bootstrap-icons/file-earmark-binary.svg?raw";
    import folder from "~/static/bootstrap-icons/folder.svg?raw";
    import folder_fill from "~/static/bootstrap-icons/folder-fill.svg?raw";
    import hdd from "~/static/bootstrap-icons/hdd.svg?raw";
    import share from "~/static/bootstrap-icons/share.svg?raw";
    import hdd_fill from "~/static/bootstrap-icons/hdd-fill.svg?raw";
    import hdd_stack_fill from "~/static/bootstrap-icons/hdd-stack-fill.svg?raw";
    import hdd_stack from "~/static/bootstrap-icons/hdd-stack.svg?raw";
    import share_fill from "~/static/bootstrap-icons/share-fill.svg?raw";
    import plus_circle from "~/static/bootstrap-icons/plus-circle.svg?raw";
    import plus from "~/static/bootstrap-icons/plus.svg?raw";
    import upload from "~/static/bootstrap-icons/upload.svg?raw";
    import download from "~/static/bootstrap-icons/download.svg?raw";
    import list from "~/static/bootstrap-icons/list.svg?raw";
    import x from "~/static/bootstrap-icons/x.svg?raw";
    import three_dots from "~/static/bootstrap-icons/three-dots-vertical.svg?raw";
    import trash from "~/static/bootstrap-icons/trash.svg?raw";
    import pen from "~/static/bootstrap-icons/pen.svg?raw";
    import link from "~/static/bootstrap-icons/link.svg?raw";
    import lock from "~/static/bootstrap-icons/lock.svg?raw";
    import unlock from "~/static/bootstrap-icons/unlock.svg?raw";
    import logout from "~/static/bootstrap-icons/box-arrow-in-right.svg?raw"
    import person from "~/static/bootstrap-icons/person.svg?raw"
    import person_fill from "~/static/bootstrap-icons/person-fill.svg?raw"
    import log from "~/static/bootstrap-icons/card-text.svg?raw"
    import backspace from "~/static/bootstrap-icons/backspace.svg?raw"
    import desc from "~/static/bootstrap-icons/caret-down-fill.svg?raw"
    import asc from "~/static/bootstrap-icons/caret-up-fill.svg?raw"
    import envelope from "~/static/bootstrap-icons/envelope.svg?raw"
    import bold from "~/static/bootstrap-icons/type-bold.svg?raw"
    import italic from "~/static/bootstrap-icons/type-italic.svg?raw"
    import strikethrough from "~/static/bootstrap-icons/type-strikethrough.svg?raw"
    import code from "~/static/bootstrap-icons/code-slash.svg?raw"
    import paragraph from "~/static/bootstrap-icons/text-paragraph.svg?raw"
    import h1 from "~/static/bootstrap-icons/type-h1.svg?raw"
    import h2 from "~/static/bootstrap-icons/type-h2.svg?raw"
    import ordered_list from "~/static/bootstrap-icons/list-ol.svg?raw"
    import unordered_list from "~/static/bootstrap-icons/list-ul.svg?raw"
    import task_list from "~/static/bootstrap-icons/list-task.svg?raw"
    import blockquote from "~/static/bootstrap-icons/blockquote-left.svg?raw"
    import line from "~/static/bootstrap-icons/hr.svg?raw"
    import camera from "~/static/bootstrap-icons/camera.svg?raw"
    import sliders from "~/static/bootstrap-icons/sliders.svg?raw"


    export default {
        data() {
            return {
                file,
                file_code,
                file_image,
                file_lock,
                file_music,
                file_movie,
                file_zip,
                file_text,
                file_table,
                file_presentation,
                file_exe,
                folder,
                folder_fill,
                hdd_fill,
                hdd_stack_fill,
                hdd_stack,
                share_fill,
                hdd,
                share,
                plus_circle,
                plus,
                upload,
                download,
                list,
                x,
                three_dots,
                trash,
                pen,
                link,
                lock,
                unlock,
                logout,
                person,
                person_fill,
                log,
                backspace,
                desc,
                asc,
                envelope,
                bold,
                italic,
                strikethrough,
                code,
                paragraph,
                h1,
                h2,
                ordered_list,
                unordered_list,
                task_list,
                blockquote,
                line,
                camera,
                sliders
            };
        },
        props:{
            icon:{
                required: false,
                type: String
            },
            file_name:{
                required: false,
                type: String
            },
            size:{
                required: false,
                type: String,
                default: "l"
            },
            color:{
                required: false,
                type: String,
                default: "primary"
            }
        },
        methods:{
            getExtension(){
                var fileExtension = require('file-extension')
                return fileExtension(this.file_name)
            },
            setIcon(){
                if(this.icon && this.icon != null){
                    switch(this.icon){
                        case "folder_fill":
                            return this.folder_fill
                            break
                        case "hdd_fill":
                            return this.hdd_fill
                            break
                        case "share_fill":
                            return this.share_fill
                            break
                        case "folder":
                            return this.folder
                            break
                        case "hdd":
                            return this.hdd
                            break
                        case "hdd_stack_fill":
                            return this.hdd_stack_fill
                            break
                        case "hdd_stack":
                            return this.hdd_stack
                            break
                        case "share":
                            return this.share
                            break
                        case "plus_circle":
                            return this.plus_circle
                            break
                        case "plus":
                            return this.plus
                            break
                        case "upload":
                            return this.upload
                            break
                        case "download":
                            return this.download
                            break
                        case "list":
                            return this.list
                            break
                        case "x":
                            return this.x
                            break
                        case "three_dots":
                            return this.three_dots
                            break
                        case "trash":
                            return this.trash
                            break
                        case "pen":
                            return this.pen
                            break
                        case "link":
                            return this.link
                            break
                        case "lock":
                            return this.lock
                            break
                        case "unlock":
                            return this.unlock
                            break
                        case "logout":
                            return this.logout
                            break
                        case "person":
                            return this.person
                            break
                        case "person_fill":
                            return this.person_fill
                            break
                        case "log":
                            return this.log
                            break
                        case "backspace":
                            return this.backspace
                            break
                        case "desc":
                            return this.desc
                            break
                        case "asc":
                            return this.asc
                            break
                        case "envelope":
                            return this.envelope
                            break
                        case "bold":
                            return this.bold
                            break
                        case "italic":
                            return this.italic
                            break
                        case "strikethrough":
                            return this.strikethrough
                            break
                        case "code":
                            return this.code
                            break
                        case "paragraph":
                            return this.paragraph
                            break
                        case "h1":
                            return this.h1
                            break
                        case "h2":
                            return this.h2
                            break
                        case "ordered_list":
                            return this.ordered_list
                            break
                        case "unordered_list":
                            return this.unordered_list
                            break
                        case "task_list":
                            return this.task_list
                            break
                        case "blockquote":
                            return this.blockquote
                            break
                        case "line":
                            return this.line
                            break
                        case "camera":
                            return this.camera
                            break
                        case "sliders":
                            return this.sliders
                            break
                        default:
                            return 
                    }
                }
                
                switch(this.getExtension()){
                    case "lock":
                        return this.file_lock
                        break
                    case "asp":
                    case "aspx":
                    case "cer":
                    case "cfm":
                    case "cgi":
                    case "pl":
                    case "css":
                    case "htm":
                    case "html":
                    case "js":
                    case "jsp":
                    case "part":
                    case "php":
                    case "py":
                    case "rss":
                    case "xhtml":
                    case "c":
                    case "class":
                    case "cpp":
                    case "cs":
                    case "h":
                    case "java":
                    case "sh":
                    case "swift":
                    case "vb":
                        return this.file_code
                        break
                    case "jpg":
                    case "jpeg":
                    case "png":
                    case "ai":
                    case "bmp":
                    case "gif":
                    case "ico":
                    case "ps":
                    case "psd":
                    case "afphoto":
                    case "svg":
                    case "tif":
                    case "tiff":
                        return this.file_image
                        break
                    case "aif":
                    case "cda":
                    case "mid":
                    case "midi":
                    case "mp3":
                    case "mpa":
                    case "ogg":
                    case "wav":
                    case "wma":
                    case "wpl":
                        return this.file_music
                        break
                    case "3g2":
                    case "3gp":
                    case "avi":
                    case "flv":
                    case "h264":
                    case "m4v":
                    case "mkv":
                    case "mov":
                    case "mp4":
                    case "mpg":
                    case "mpeg":
                    case "rm":
                    case "swf":
                    case "vob":
                    case "wmv":
                        return this.file_movie
                        break
                    case "7z":
                    case "arj":
                    case "deb":
                    case "pkg":
                    case "rar":
                    case "rpm":
                    case "gz":
                    case "z":
                    case "zip":
                        return this.file_zip
                        break
                    case "doc":
                    case "docx":
                    case "odt":
                    case "pdf":
                    case "rtf":
                    case "tex":
                    case "txt":
                    case "wpd":
                        return this.file_text
                        break
                    case "fnt":
                    case "fon":
                    case "otf":
                    case "ttf":
                        return this.file_font
                        break
                    case "ods":
                    case "xls":
                    case "xlsm":
                    case "xlsx":
                        return this.file_table
                        break
                    case "key":
                    case "odp":
                    case "pps":
                    case "ppt":
                    case "pptx":
                        return this.file_presentation
                        break
                    case "apk":
                    case "bat":
                    case "bin":
                    case "com":
                    case "exe":
                    case "gadget":
                    case "jar":
                    case "msi":
                    case "wsf":
                        return this.file_exe
                        break
                    case "folder":
                        return this.folder
                        break
                    default:
                        return this.file
                }                
            }
        }
    };
</script>

<style lang="scss" scoped>
    .primary:nth-child(n){
        color: var(--color-primary) !important;
    }
    .secondary:nth-child(n){
        color: var(--color-secondary) !important;
    }
    .info:nth-child(n){
        color: var(--color-info) !important;
    }
    .dark-grey:nth-child(n){
        color: $dark-grey !important;
    }
    .muted:nth-child(n){
        color: rgb(153, 153, 153)!important;
    }
    .white:nth-child(n){
        color: white !important;
    }
    .xxs:nth-child(n){
        font-size: 10pt !important;
    }
    .xs:nth-child(n){
        font-size: 12pt !important;
    }
    .s:nth-child(n){
        font-size: 15pt !important;
    }
    .m:nth-child(n){
        font-size: 20pt !important;
    }
    .l:nth-child(n){
        font-size: 26pt !important;
    }
    .media{
        &-default:nth-child(n){
            @media (max-width: 576px) {
                color: $charcoal !important;
            }
        }
        &-info:nth-child(n){
            @media (max-width: 576px) {
                color: var(--color-info) !important;
            }
        }
        &-dark-grey:nth-child(n){
            @media (max-width: 576px) {
                color: $dark-grey !important;
            }            
        }
        &-muted:nth-child(n){
            @media (max-width: 576px) {
                color: rgb(153, 153, 153) !important;
            }            
        }
        &-white:nth-child(n){
            @media (max-width: 576px) {
                color: white !important;
            }
        }
        &-xxs:nth-child(n){
            @media (max-width: 576px) {
                font-size: 10pt !important;    
            }            
        }
        &-xs:nth-child(n){
            @media (max-width: 576px) {
                font-size: 14pt !important;    
            }            
        }
        &-s:nth-child(n){
            @media (max-width: 576px) {
                font-size: 15pt !important;
            }            
        }
        &-m:nth-child(n){
            @media (max-width: 576px) {
                font-size: 20pt !important;
            }            
        }
        &-l:nth-child(n){
            @media (max-width: 576px) {
                font-size: 26pt !important;
            }            
        }
    }
</style>