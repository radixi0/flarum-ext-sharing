import Component from 'flarum/Component';
import icon from 'flarum/helpers/icon';

export default class SharingMenuItem extends Component {
  view() {
    return (
      <button className="SubscriptionMenuItem hasIcon" onclick={this.props.onclick}>
        <span className="SubscriptionMenuItem-label">
          {icon(this.props.icon, {className: 'Button-icon'})}
          <strong>{this.props.label}</strong>          
        </span>
      </button>
    );
  }
}
