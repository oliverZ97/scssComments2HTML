import '../res/index.scss';
import '..'
import hljs from 'highlight.js';
import 'highlight.js/styles/a11y-dark.css';
import 'clipboard';
import './lsg_functionality.js';

hljs.initHighlightingOnLoad();

const startClipboard = function(event) {
    new ClipboardJS('.clipboard');
}

if(window.attachEvent) {
    window.attachEvent('onload', startClipboard);
 } else {
    if(window.onload) {
        var curronload = window.onload;
        var newonload = function(evt) {
            curronload(evt);
            startClipboard(evt);
        };
        window.onload = newonload;
    } else {
        window.onload = startClipboard;
    }
 }