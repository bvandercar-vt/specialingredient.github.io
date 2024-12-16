export const Header = () => {
  return (
    <header>
      <div id="header-center">
        <img src="/Logo Outlined.svg" alt="Special Ingredient Bass Mixes" id="header-logo-img" />
      </div>
      <div id="header-right">
        <div id="bio" role="region" aria-label="bio">
          All forms of bass music 🌀
          <br />
          Tracklist in every mix 🎵
          <br />
          For your bike rides, hikes, walks, and long drives 🙃
          <br />
          Take a journey 🏕️
          <br />
          Denver based 🏔️ from Wisconsin 🧀
          <br />
          AKA DJ Smoothbrain 😉
        </div>
        <div id="social-links" role="region" aria-label="social links">
          <a
            className="circle fa fa-soundcloud"
            title="SoundCloud"
            href="https://www.soundcloud.com/special-ingredient"
            target="_blank"
          />
          <a
            className="circle fa fa-twitter"
            title="Twitter"
            href="https://www.twitter.com/dj_smoothbrain"
            target="_blank"
          />
          <a
            className="circle fa fa-instagram"
            title="Instagram"
            href="https://www.instagram.com/special_ingredient_bass"
            target="_blank"
          />
          <a
            className="circle fa fa-reddit"
            title="Reddit"
            href="https://www.reddit.com/user/SpecialIngredient"
            target="_blank"
          />
          <a
            className="circle fa fa-facebook"
            title="Facebook"
            href="https://www.facebook.com/profile.php?id=100087612335247"
            target="_blank"
          />
          <a
            className="circle fa fa-envelope"
            title="Email"
            onClick={() => {
              const EMAIL = 'SpecialIngredientBass@gmail.com'
              navigator.clipboard.writeText(EMAIL)
              alert('Copied to clipboard: ' + EMAIL)
            }}
          />
        </div>
      </div>
    </header>
  )
}
