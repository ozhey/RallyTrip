const modules = {
    toolbar: [
        [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
        [{ 'direction': 'rtl' }, { 'align': [] }],                         // text direction
        [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
        ['link', 'image', 'video'],
        ['clean'],
    ],
}

// Quill 2: bullet/ordered lists are both the 'list' format.
const formats = [
    'size',
    'bold', 'italic', 'underline', 'strike',
    'list', 'indent',
    'link', 'image', 'video', 'direction',
    'color', 'background', 'align'
]

// Blank RTL document — used to reset the editor.
const EMPTY_EDITOR_VALUE = '<p class="ql-align-right ql-direction-rtl"><br></p>';

export { modules, formats, EMPTY_EDITOR_VALUE }
