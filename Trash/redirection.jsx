import { useHistory } from 'react-router-dom',


class redirection extends Component {

  faireRedirection = () => {
    let url = "maNouvelleURL",
      let history = useHistory(),
      history.push(url),
  }

  render() {
    return (
      <Button color="primary" className="px-4"
        onClick={this.faireRedirection}
      >
        Mon Bouton va rediriger sur "maNouvelleURL" si on clique dessus
      </Button>
    ),
  }
}
export default redirection,