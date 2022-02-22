import React, { Component, useRef, useState } from "react";
import { View, StyleSheet, Text, Image, TouchableHighlight, TouchableOpacity } from "react-native";
import QuillEditor from "react-native-cn-quill";
import Popover from 'react-native-popover-view';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { customFonts } from './customFonts';


class RTEComponent extends Component<any, any> {
    private _editor: React.RefObject<QuillEditor>;

    constructor(props:any) {
        super(props);
        this.state = {
            toolbarState: {
                isBold: false,
                isItalic: false,
                selectedColor: "",
                selectedFontsize: "small"
            }
        };
        this._editor = React.createRef();
    }
    async onQuillEditorSelectionChange() { //{ range: { index, lengthmber } , oldRange: { index, length }, source }
        
        this._editor?.current?.getFormat().then((res:any) => {
            const toolbarState: IToolbarState = {}
            toolbarState.isItalic = res.italic ? res.italic : false
            toolbarState.isBold = res.bold ? res.bold : false
            toolbarState.selectedColor = res.background ? res.background : ""
            toolbarState.selectedFontsize = res.size ? res.size : "20px"
            this.setState({ toolbarState })
        });
    }
    componentDidMount() { }
    onBackNavPress() { }
    onNoteNamePress() { }
    onNoteSubmit() {
        this._editor?.current?.getHtml().then((res:any) => {
            console.log('Html :', res);
        });
    }
    onToolbarItemPress(selectedPopover:any, type:any, data:any) {
        if (type && type == "attachment") {
            this._editor?.current?.insertEmbed(10, 'image', data.uri);
        } else {
            this.setState({ toolbarState: selectedPopover })
            this._editor?.current?.format('bold', selectedPopover.isBold);
            this._editor?.current?.format('italic', selectedPopover.isItalic);
            this._editor?.current?.format('background', selectedPopover.selectedColor);
            this._editor?.current?.format('size', selectedPopover.selectedFontsize);
        }
    }
    render() {
        return (
            <View style={{ flex: 1 }}>
                <View style={styles.topHeaderContainerStyle}>
                    <TouchableHighlight onPress={this.onBackNavPress.bind(this)} style={styles.topHeaderBackNavImageContStyle}>
                        <Image style={styles.topHeaderBackNavImageStyle} source={require("../assets/nav_back.png")} />
                    </TouchableHighlight>
                    <TouchableHighlight onPress={this.onNoteNamePress.bind(this)} style={styles.topHeaderNavTextContStyle}>
                        <Text style={styles.topHeaderNavTextStyle}>New Note</Text>
                    </TouchableHighlight>
                    <TouchableHighlight onPress={this.onNoteSubmit.bind(this)} style={styles.topHeaderNavCheckContStyle}>
                        <Image style={styles.topHeaderNavCheckStyle} source={require("../assets/checked.png")} />
                    </TouchableHighlight>
                </View>
                <ToolbarRTE onToolbarItemPress={this.onToolbarItemPress.bind(this)} toolbarState={this.state.toolbarState} />
                <QuillEditor
                    defaultFontFamily={"CalibreRegular"}
                    customFonts={customFonts}
                    onSelectionChange={this.onQuillEditorSelectionChange.bind(this)}
                    style={styles.editor}
                    onFocus={() => { }}
                    onEditorChange={() => { }}
                    loading="loading"
                    customJS={
                        `
                            var Size = Quill.import('attributors/style/size');
                            Size.whitelist = ['16px','20px', '24px', '28px','32px'];
                            Quill.register(Size, true);
                        `
                    }
                    theme={{ background: "white", color: "black", placeholder: "##979797" }}
                    ref={this._editor}
                    import3rdParties="cdn"
                    quill={{
                        placeholder: 'Add text...',
                        modules: { toolbar: false },
                        theme: 'snow',
                    }}
                />
            </View>
        );
    }
}

export default RTEComponent

const ToolbarRTE = ({ onToolbarItemPress, toolbarState }:{onToolbarItemPress:Function,toolbarState:any}) => {
    const toolbarItemHighlightRef:any = useRef();
    const toolbarItemAttachmentRef:any = useRef();
    const toolbarItemFontSizeRef:any = useRef();
    const [selectedPopover, setselectedPopover] = useState("");
    const onHighlightColourChange = (color:any) => {
        toolbarState.selectedColor = color;
        setselectedPopover("");
        onToolbarItemPress(toolbarState);
    }
    const onFontSizeChange = (fontSize:any) => {
        toolbarState.selectedFontsize = fontSize;
        setselectedPopover("");
        onToolbarItemPress(toolbarState);
    }
    const onAttachmentTypeClick = (type:any) => {
        setselectedPopover("");
        switch (type) {
            case "Open Camera":
                {
                    launchCamera({ mediaType: "photo" }, (res: any) => {
                        res.uri = "https://picsum.photos/200/300";
                        onToolbarItemPress(toolbarState, "attachment", res);
                    })
                }
                break;
            case "Open Gallery":
                {
                    launchImageLibrary({ mediaType: "photo", selectionLimit: 1 }, (res: any) => {
                        res.uri = "https://picsum.photos/200/300";
                        onToolbarItemPress(toolbarState, "attachment", res);
                    })
                }
                break;
        }
    }
    const colors = ["No-fill", "Red", "Green", "Blue", "Yellow"];
    const fontSizes = [{name:'16',value:'16px'},{name:'20',value:'20px'}, {name:'24',value:'24px'}, {name:'28',value:'28px'},{name:'32',value:'32px'}];
    const attachmentTypes = ["Open Camera", "Open Gallery"];
    return (
        <View>
            <View style={[toolbarRTEStyles.containerStyle]}>
                <TouchableOpacity
                    onPress={() => {
                        toolbarState['isBold'] = !toolbarState.isBold
                        onToolbarItemPress(toolbarState)
                    }}
                    style={[toolbarRTEStyles.toolBarItemContainerStyle, toolbarState.isBold ? { backgroundColor: "#a7c0e8" } : {}]}
                >
                    <Text style={[toolbarRTEStyles.toolBarItemStyle]}>B</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        toolbarState['isItalic'] = !toolbarState.isItalic;
                        onToolbarItemPress(toolbarState)
                    }}
                    style={[toolbarRTEStyles.toolBarItemContainerStyle, toolbarState.isItalic ? { backgroundColor: "#a7c0e8" } : {}]}
                >
                    <Text style={[toolbarRTEStyles.toolBarItemStyle, toolbarRTEStyles.toolBarItalicStyle]}>i</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    ref={toolbarItemHighlightRef}
                    onPress={() => {
                        onToolbarItemPress(toolbarState)
                        setselectedPopover("highlighter")
                    }}
                    style={[toolbarRTEStyles.toolBarItemContainerStyle]}
                >
                    <Text style={[toolbarRTEStyles.toolBarItemStyle, toolbarRTEStyles.toolBarHighlightStyle]}>HL</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    ref={toolbarItemFontSizeRef}
                    onPress={() => {
                        onToolbarItemPress(toolbarState)
                        setselectedPopover("fontsize")
                    }}
                    style={[toolbarRTEStyles.toolBarItemContainerStyle]}
                >
                    <Text style={[toolbarRTEStyles.toolBarItemStyle]}>8</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    ref={toolbarItemAttachmentRef}
                    style={[toolbarRTEStyles.toolBarItemContainerStyle]}
                    onPress={() => {
                        setselectedPopover("attachment")
                    }}
                >
                    <Text style={[toolbarRTEStyles.toolBarItemStyle]}>At</Text>
                </TouchableOpacity>
            </View>
            <Popover from={toolbarItemHighlightRef} isVisible={selectedPopover == "highlighter"} onRequestClose={() => setselectedPopover("")}>
                <View style={[toolbarRTEStyles.popoverMenuContainerStyle]}>
                    {colors.map((color, i) => {
                        const _color = color !== "No-fill" ? color.toLowerCase() : "";
                        return (
                            <TouchableOpacity key={`colorPicker-${i}`} onPress={() => onHighlightColourChange(_color)} style={[{ flexDirection: "row", padding: 8 }, i < colors.length - 1 ? { borderBottomColor: "#282942", borderBottomWidth: 1 } : {}]}>
                                <View style={[toolbarRTEStyles.highlighterColorBoxStyle, { backgroundColor: _color }]}>
                                    {toolbarState.selectedColor == _color ? <Image style={toolbarRTEStyles.selectcolorImageStyle} source={require("../assets/checked.png")} /> : null}
                                </View>
                                <Text>{color}</Text>
                            </TouchableOpacity>
                        )
                    })}
                </View>
            </Popover>
            <Popover from={toolbarItemFontSizeRef} isVisible={selectedPopover == "fontsize"} onRequestClose={() => setselectedPopover("")}>
                <View style={[toolbarRTEStyles.popoverMenuContainerStyle]}>
                    {fontSizes.map((fontSize, i) => {
                        // const _fontSize = fontSize.toLowerCase();
                        return (
                            <TouchableOpacity key={`fontSizePicker-${i}`} onPress={() => { onFontSizeChange(fontSize.value) }} style={[{ justifyContent: "center", flexDirection: "row", padding: 5 }, toolbarState.selectedFontsize == fontSize.value ? { backgroundColor: "#b1b8c7" } : {}, i < fontSizes.length - 1 ? { borderBottomWidth: 1, borderBottomColor: "#282942" } : {}]}>
                                <View style={[toolbarRTEStyles.fontSizePopoverBoxStyle]}>
                                    <Text>{fontSize.name}</Text>
                                </View>
                            </TouchableOpacity>
                        )
                    })}
                </View>
            </Popover>
            <Popover from={toolbarItemAttachmentRef} isVisible={selectedPopover == "attachment"} onRequestClose={() => setselectedPopover("")}>
                <View style={[toolbarRTEStyles.popoverMenuContainerStyle]}>
                    {attachmentTypes.map((attachmentType, i) => {
                        return (
                            <TouchableOpacity key={`attachmentSelector-${i}`} onPress={() => { onAttachmentTypeClick(attachmentType) }} style={[{ justifyContent: "center", flexDirection: "row", padding: 5 }, i < attachmentTypes.length - 1 ? { borderBottomWidth: 1, borderBottomColor: "#282942" } : {}]}>
                                <View style={[toolbarRTEStyles.fontSizePopoverBoxStyle]}>
                                    <Text>{attachmentType}</Text>
                                </View>
                            </TouchableOpacity>
                        )
                    })}
                </View>
            </Popover>
        </View>
    );
}


const toolbarRTEStyles = StyleSheet.create({
    popoverMenuContainerStyle: {
        margin: 2,
        borderColor: "#666769",
        borderWidth: 1
    },
    selectcolorImageStyle: {
        width: 15,
        height: 15,
        resizeMode: "contain",
    },
    highlighterColorBoxStyle: {
        height: 20,
        width: 20,
        backgroundColor: "white",
        borderColor: "black",
        borderWidth: 1,
        marginRight: 5,
        alignItems: "center",
        justifyContent: "center"
    },
    fontSizePopoverBoxStyle: {
        marginRight: 5
    },
    containerStyle: {
        marginTop: 10,
        flexDirection: "row",
        justifyContent: "center"
    },
    toolBarItemStyle: {
        fontWeight: "bold",
        color: "grey",
        fontSize: 18
    },
    toolBarHighlightStyle: {
        color: "#0d91fc",
    },
    toolBarItalicStyle: {
        fontStyle: "italic",
    },
    toolBarItemContainerStyle: {
        borderColor: "grey",
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderRadius: 5,
        marginHorizontal: 5,
        minHeight: 40,
        minWidth: 40,
    }
});
const styles = StyleSheet.create({
    title: {
        fontWeight: 'bold',
        alignSelf: 'center',
        paddingVertical: 10,
    },
    root: {
        flex: 1,
        backgroundColor: 'white',
    },
    toolbar: {
        borderColor: 'white',
        backgroundColor: 'white'
    },
    topHeaderContainerStyle: {
        flexDirection: "row",
        backgroundColor: "#ebebeb"
    },
    topHeaderNavCheckContStyle: {
    },
    topHeaderBackNavImageContStyle: {
    },
    topHeaderNavTextContStyle: {
        alignSelf: "center",
        flex: 1,
    },

    topHeaderNavCheckStyle: {
        margin: 5,
        width: 30,
        height: 30,
        resizeMode: "contain",
    },
    topHeaderBackNavImageStyle: {
        margin: 5,
        width: 30,
        height: 30,
        resizeMode: "contain",
    },
    topHeaderNavTextStyle: {
        textAlign: "center",
    },
    editor: {
        flex: 1,
        padding: 0,
        borderColor: 'white',
        borderRadius: 14,
        borderWidth: 1,
        // margin: 5,
        backgroundColor: 'white',
    },
    input: {
        borderColor: 'gray',
        borderWidth: 1,
        marginHorizontal: 30,
        marginVertical: 5,
        backgroundColor: 'white',
    },
    textbox: {
        height: 40,
        paddingHorizontal: 20,
    },
    buttons: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    btn: {
        alignItems: 'center',
        backgroundColor: '#ddd',
        padding: 10,
        margin: 3,
    },
});

interface IToolbarState {
    isBold?: boolean;
    isItalic?: boolean;
    selectedColor?: string;
    selectedFontsize?: string;
}