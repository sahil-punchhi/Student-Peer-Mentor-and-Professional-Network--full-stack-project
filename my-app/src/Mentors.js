import React, {Component} from 'react';
import Typography from '@material-ui/core/Typography';
import axios from "axios";
import MentorCard from "./MentorCard";
import Grid from "@material-ui/core/Grid";
import InputBase from "@material-ui/core/InputBase";
import IconButton from "@material-ui/core/IconButton";
import SearchIcon from '@material-ui/icons/Search';
import Paper from "@material-ui/core/Paper";


// Find mentors page
class Mentors extends Component {
    constructor() {
        super();
        this.state = {
            persons: [],
            all: [],
            search: '',
        };
        this.updateField = this.updateField.bind(this);
        this.searchCard = this.searchCard.bind(this);
    }

    // get all users' info
    componentDidMount() {
        axios.get('http://localhost:8000/api/v2/persons')
            .then((response) => {
                console.log(response);
                this.setState({
                    persons: response.data,
                    all: response.data,
                });
            });
    }

    updateField(e) {
        const target = e.target;
        const name = target.name;

        let value = target.value;

        this.setState({
            [name]: value
        });
        this.searchCard();
    }

    // search user based on keyword
    searchCard() {
        let keyword = this.state.search.toLowerCase();
        let all = this.state.all;
        const persons = all.filter(person => {
            let result = false;
            if (person.name) {
                result = result || person.name.toLowerCase().includes(keyword);
            }
            if (person.location) {
                result = result || person.location.toLowerCase().includes(keyword);
            }
            if (person.desc) {
                result = result || person.desc.toLowerCase().includes(keyword);
            }
            return result;
        });
        this.setState({
            persons: persons
        });
    }

    render() {
        return (
            <div>
                <Typography variant="h4" component="h4">
                    Find Mentors
                </Typography>
                <br/>
                <Paper component="form" style={{border: '1px', padding: '1px 10px', width: '300px'}}>
                    <InputBase style={{width: '230px'}}
                           placeholder="Search mentors"
                           name="search"
                           value={this.state.search}
                           onKeyUp={this.updateField}
                           onChange={this.updateField}
                           tabIndex="0"
                    />
                    <IconButton onClick={this.searchCard}>
                        <SearchIcon/>
                    </IconButton>
                </Paper>
                <Grid container spacing={3}>
                    {this.state.persons.map((person) =>
                        <Grid item xs={12} sm={6} md={4} lg={3} key={person.id} style={{marginTop: '1rem'}}>
                            <MentorCard
                                title={person.name}
                                description={person.desc}
                                type={person.type}
                                location={person.location}
                            />
                        </Grid>
                    )}
                </Grid>
            </div>
        )
    }
}

export default Mentors;
