import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import Slide from '@material-ui/core/Slide';
import CardActionArea from "@material-ui/core/CardActionArea/CardActionArea";
import Card from "@material-ui/core/Card/Card";
import Typography from "@material-ui/core/Typography/Typography";
import Button from "@material-ui/core/Button/Button";
import moment from 'moment';
import AppBar from "@material-ui/core/AppBar/AppBar";
import Toolbar from "@material-ui/core/Toolbar/Toolbar";
import IconButton from "@material-ui/core/IconButton/IconButton";
import CloseIcon from '@material-ui/icons/Close';
import Box from "@material-ui/core/Box/Box";
import axios from "axios";
import Grid from "@material-ui/core/Grid/Grid";
import CommentList from "./reply_list";
import Pagination from "@material-ui/lab/Pagination/Pagination";
import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import ReactQuill from "react-quill";
import DialogActions from "@material-ui/core/DialogActions/DialogActions";
import Divider from "@material-ui/core/Divider/Divider";


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

// export default function CreatePostDialog() {
class PostDetailDialog extends React.Component {
    constructor(props){
    super(props);
    this.state = {
        open_01: false,
        currentPost: [],
        replyList: [],
        currentPage: 1,
        count: 0,
        open_02: false,
        content: '',
    };

    this.modules = {
            toolbar: [
                [{ 'header': [1, 2, false] }],
                ['bold', 'italic', 'underline','strike', 'blockquote'],
                [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
                ['link', 'image'],
                ['clean']
            ],
        };
        this.formats = [
            'header',
            'bold', 'italic', 'underline', 'strike', 'blockquote',
            'list', 'bullet', 'indent',
            'link', 'image'
        ];

    this.handleClickOpen_01 = this.handleClickOpen_01.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.handleClickOpen_02 = this.handleClickOpen_02.bind(this);
    this.handleContentChange = this.handleContentChange.bind(this);
    }

    componentDidMount () {
        axios.get("http://127.0.0.1:8000/reply/", {
            params:{
                post: this.state.currentPost.id,
                page: this.state.currentPage,
            }
        }).then(res => {
            this.setState({
                replyList: res.data,
                count: res.data[0].count,
            });

        }).catch(err => {
        })
    }

    //event when page changes
    handlePageChange(event, value) {
        this.setState({
            currentPage: value,
        },()=> {
                this.componentDidMount ();
            });
    }

    //event when clicking the card in forum page into a single post page
    handleClickOpen_01 (currentPost) {
        this.setState({
            open_01: true,
            currentPost: currentPost,
        });
        axios.get("http://127.0.0.1:8000/reply/", {
            params:{
                post: currentPost.id,
                page: this.state.currentPage,
            }
        }).then(res => {
            this.setState({
                replyList: res.data,
                count: res.data[0].count,
            });
        }).catch(err => {
        })
    };

    //event when closing current post
    handleClose_01 = () => {
        this.setState({
            open_01: false,
            currentPost: [],
            replyList: [],
            count: 0
        })
    };

    //event when opening comment form
    handleClickOpen_02 () {
        this.setState({
            open_02: true
        });
    };

    //event when closing comment form
    handleClose_02 = () => {
        this.setState({
            open_02: false,
            content: ''
        })
    };

    //monitoring Content field
    handleContentChange (value){
        this.setState({
            content: value
        })
    };

    //handling form submit
    handleSubmit = () => {
        axios.post("http://127.0.0.1:8000/reply/", {
            content: this.state.content,
            parent_id: 0,
            replyTo_id: this.state.currentPost.poster,
            poster: localStorage.getItem('user'),
            post: this.state.currentPost.id,
        }).then(res => {
            alert('post successfully');
            this.setState({
                open_02: false,
                content: ''
            })
            this.componentDidMount ();
        }).catch(err => {
            alert('error!!!')
        });
    }

    render() {
        //for generating the post list in the forum home page
        const post_list = this.props.data.map(post =>
            <CardActionArea component="a" onClick={()=>this.handleClickOpen_01(post) } style={{marginBottom:20}}>
                <Card variant="outlined">
                    <Typography color="primary"  variant="subtitle1" component="h3" style={{marginLeft:20, marginTop:8}}>
                        Title: {post.title}</Typography>
                    <Typography variant="subtitle1" color="textSecondary" style={{marginLeft:20, marginTop:5}} >
                        Poster: {post.username}
                    </Typography>
                    <Typography variant="body1" noWrap>
                        <div style={{marginLeft:22}}
                             dangerouslySetInnerHTML={{__html:post.content.length>150 ? post.content.substr(0, 150) + "..." : post.content}}>
                        </div>
                    </Typography>
                    <Typography variant="subtitle1" color="textSecondary" style={{position: 'relative',
                        left: '77%',}} component="h5">
                        posted at {moment(post.createdAt).format('YYYY-MM-DD HH:mm:ss')}
                    </Typography>
                    </Card>
            </CardActionArea>
        );

        return (
            <div>
                <div>
                    {post_list}
                </div>

                <Dialog fullScreen open={this.state.open_01} onClose={this.handleClose_01} TransitionComponent={Transition}>
                    <AppBar style={{position: 'relative'}}>
                        <Toolbar>
                            <IconButton edge="start" color="inherit" onClick={this.handleClose_01} aria-label="close">
                                <CloseIcon/>
                            </IconButton>
                            <Box mx="auto" p={1}>
                                <Typography variant="h4">
                                    {this.state.currentPost.title}
                                </Typography>
                            </Box>
                        </Toolbar>
                    </AppBar>

                    <div style={{marginTop: 10, marginRight:50, marginLeft:50}}>
                        <div >
                            <br/>
                            <div>
                                Author: {this.state.currentPost.username}
                                <div style={{position:'relative', left:'70%', marginBottom:'5'}}>
                                    Posted at: {moment(this.state.currentPost.createdAt).format('YYYY-MM-DD HH:mm:ss')}
                                </div>
                            </div>
                        </div>

                        <Divider />

                        <div>
                            <div dangerouslySetInnerHTML={{__html:this.state.currentPost.content}}></div>
                        </div>
                        <Divider />
                    </div>

                    <div >
                        <Button style={{marginLeft:80, marginTop:20, marginBottom:20}}
                            variant="outlined" color="primary" onClick={this.handleClickOpen_02}>
                        Comment
                        </Button>
                        <Divider  style={{marginRight:50, marginLeft:50}}/>
                        <Dialog open={this.state.open_02} onClose={this.handleClose_02} aria-labelledby="form-dialog-title">
                            <DialogTitle id="form-dialog-title">Write Your Comment</DialogTitle>
                            <DialogContent style={{width: 650, height: 380}}>
                            <ReactQuill
                                theme="snow"
                                modules={this.modules}
                                formats={this.formats}
                                style={{height: 300, width: 500}}
                                value={this.state.content}
                                onChange={this.handleContentChange}>
                            </ReactQuill>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={this.handleClose_02} color="primary">
                                Cancel
                                </Button>
                                <Button onClick={this.handleSubmit} color="primary">
                                Submit
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </div>
                    <br/>

                    <Grid style={{marginLeft:60, marginRight:60, marginTop:5}}>
                    <CommentList style={{overflow:'hidden'}} data={this.state.replyList}/>
                    <br/>
                    <Pagination count={this.state.count} color="primary" style={{position: 'relative',
                                left: '65%',}} page={this.state.currentPage} onChange={this.handlePageChange}

                                showFirstButton showLastButton />
                    <br/>
                    </Grid>

                </Dialog>
            </div>
        );
    }
}

export default (PostDetailDialog);
