import React, { useState, useEffect } from 'react';

// This component encapsulates a MailerLite subscription form with Turkish content.
// It uses the useEffect hook to safely load external scripts required for reCAPTCHA and form submission.
// It also manages the form's success state internally.
const MailFormu: React.FC = () => {
  // State to toggle between the form and the success message
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  useEffect(() => {
    // The MailerLite script calls this global function on successful form submission.
    // We define it here and attach it to the window object.
    // When called, it updates our component's state to show the success message.
    (window as any).ml_webform_success_29674437 = () => {
      setIsSuccess(true);
    };

    // Helper function to dynamically load a script
    const loadScript = (src: string) => {
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      document.body.appendChild(script);
      return script;
    };

    // Load necessary external scripts
    const recaptchaScript = loadScript('https://www.google.com/recaptcha/api.js');
    const mailerliteScript = loadScript('https://groot.mailerlite.com/js/w/webforms.min.js?v176e10baa5e7ed80d35ae235be3d5024');

    // This fetch call is for MailerLite's tracking purposes.
    fetch("https://assets.mailerlite.com/jsonp/1738794/forms/162904520078133099/takel").catch(console.error);

    // Cleanup function: remove scripts and the global function when the component unmounts.
    return () => {
      if (recaptchaScript.parentNode) {
        recaptchaScript.parentNode.removeChild(recaptchaScript);
      }
      if (mailerliteScript.parentNode) {
        mailerliteScript.parentNode.removeChild(mailerliteScript);
      }
      delete (window as any).ml_webform_success_29674437;
    };
  }, []); // Empty dependency array ensures this runs only once when the component mounts.

  // All CSS from the original HTML is bundled here.
  const allCss = `
    @import url("https://assets.mlcdn.com/fonts.css?version=1755079");
    /* LOADER */
    .ml-form-embedSubmitLoad {
      display: inline-block;
      width: 20px;
      height: 20px;
    }
    .g-recaptcha {
      transform: scale(1);
      -webkit-transform: scale(1);
      transform-origin: 0 0;
      -webkit-transform-origin: 0 0;
    }
    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0,0,0,0);
      border: 0;
    }
    .ml-form-embedSubmitLoad:after {
      content: " ";
      display: block;
      width: 11px;
      height: 11px;
      margin: 1px;
      border-radius: 50%;
      border: 4px solid #fff;
      border-color: #ffffff #ffffff #ffffff transparent;
      animation: ml-form-embedSubmitLoad 1.2s linear infinite;
    }
    @keyframes ml-form-embedSubmitLoad {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    #mlb2-29674437.ml-form-embedContainer {
      box-sizing: border-box; display: table; margin: 0 auto; position: static; width: 100% !important;
    }
    #mlb2-29674437.ml-form-embedContainer h4,
    #mlb2-29674437.ml-form-embedContainer p,
    #mlb2-29674437.ml-form-embedContainer span,
    #mlb2-29674437.ml-form-embedContainer button {
      text-transform: none !important; letter-spacing: normal !important;
    }
    #mlb2-29674437.ml-form-embedContainer .ml-form-embedWrapper {
      background-color: #1f2937; border-width: 0px; border-color: transparent; border-radius: 4px; border-style: solid; box-sizing: border-box; display: inline-block !important; margin: 0; padding: 0; position: relative;
    }
    #mlb2-29674437.ml-form-embedContainer .ml-form-embedWrapper.embedForm { max-width: 400px; width: 100%; }
    #mlb2-29674437.ml-form-embedContainer .ml-form-align-center { text-align: center; }
    #mlb2-29674437.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody,
    #mlb2-29674437.ml-form-embedContainer .ml-form-embedWrapper .ml-form-successBody {
      padding: 20px 20px 0 20px;
    }
    #mlb2-29674437.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-embedContent,
    #mlb2-29674437.ml-form-embedContainer .ml-form-embedWrapper .ml-form-successBody .ml-form-successContent {
      text-align: left; margin: 0 0 20px 0;
    }
    #mlb2-29674437.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-embedContent h4,
    #mlb2-29674437.ml-form-embedContainer .ml-form-embedWrapper .ml-form-successBody .ml-form-successContent h4 {
      color: #bac0c6; font-family: 'Montserrat', sans-serif; font-size: 25px; font-weight: 400; margin: 0 0 10px 0; text-align: left; word-break: break-word;
    }
    #mlb2-29674437.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-embedContent p,
    #mlb2-29674437.ml-form-embedContainer .ml-form-embedWrapper .ml-form-successBody .ml-form-successContent p {
      color: #bac0c6; font-family: 'Montserrat', sans-serif; font-size: 10px; font-weight: 400; line-height: 16px; margin: 0 0 10px 0; text-align: left;
    }
    #mlb2-29674437.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody form { margin: 0; width: 100%; }
    #mlb2-29674437.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-formContent {
      margin: 0 0 20px 0; width: 100%;
    }
    #mlb2-29674437.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-fieldRow {
      margin: 0 0 10px 0; width: 100%;
    }
    #mlb2-29674437.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-fieldRow.ml-last-item { margin: 0; }
    #mlb2-29674437.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-fieldRow input {
      background-color: #ffffff !important; color: #333333 !important; border-color: #cccccc; border-radius: 4px !important; border-style: solid !important; border-width: 1px !important; font-family: 'Open Sans', Arial, Helvetica, sans-serif; font-size: 14px !important; height: auto; line-height: 21px !important; margin: 0; padding: 10px 10px !important; width: 100% !important; box-sizing: border-box !important; max-width: 100% !important;
    }
    #mlb2-29674437.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-embedSubmit {
      margin: 0 0 20px 0; float: left; width: 100%;
    }
    #mlb2-29674437.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-embedSubmit button {
      background-color: #000000 !important; border: none !important; border-radius: 4px !important; box-shadow: none !important; color: #ffffff !important; cursor: pointer; font-family: 'Open Sans', Arial, Helvetica, sans-serif !important; font-size: 14px !important; font-weight: 700 !important; line-height: 21px !important; height: auto; padding: 10px !important; width: 100% !important; box-sizing: border-box !important;
    }
    #mlb2-29674437.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-embedSubmit button:hover {
      background-color: #333333 !important;
    }
    #mlb2-29674437.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-interestGroupsRow {
      margin-bottom: 20px; text-align: left; float: left; width: 100%;
    }
    #mlb2-29674437.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-interestGroupsRow .ml-form-interestGroupsRowCheckbox {
      margin: 0 0 10px 0; width: 100%;
    }
    #mlb2-29674437.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-interestGroupsRow .ml-form-interestGroupsRowCheckbox.last-group { margin: 0; }
    #mlb2-29674437.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-interestGroupsRow .ml-form-interestGroupsRowCheckbox label {
      font-weight: normal; margin: 0; padding: 0; position: relative; display: block; min-height: 24px; padding-left: 24px;
    }
    #mlb2-29674437.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-interestGroupsRow .ml-form-interestGroupsRowCheckbox .label-description {
      color: #000000; font-family: 'Open Sans', Arial, Helvetica, sans-serif; font-size: 12px; line-height: 18px; text-align: left; margin-bottom: 0; position: relative; vertical-align: top; font-style: normal; font-weight: 700;
    }
    #mlb2-29674437.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-interestGroupsRow .ml-form-interestGroupsRowCheckbox input[type="checkbox"] {
      box-sizing: border-box; padding: 0; position: absolute; z-index: -1; opacity: 0; margin-top: 5px; margin-left: -1.5rem; overflow: visible;
    }
    #mlb2-29674437.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-embedPermissions {
      text-align: left; float: left; width: 100%;
    }
    #mlb2-29674437.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-embedPermissions .ml-form-embedPermissionsContent {
      margin: 0 0 15px 0;
    }
    #mlb2-29674437.ml-form-embedContainer .ml-form-embedWrapper .ml-form-embedBody .ml-form-embedPermissions .ml-form-embedPermissionsContent p {
      color: #000000; font-family: 'Open Sans', Arial, Helvetica, sans-serif; font-size: 12px; line-height: 22px; margin: 0 0 10px 0;
    }
    .ml-form-recaptcha { margin-bottom: 20px; }
    .ml-form-recaptcha.ml-error iframe { border: solid 1px #ff0000; }
    @media screen and (max-width: 480px) {
      .ml-form-recaptcha { width: 220px!important; }
      .g-recaptcha { transform: scale(0.78); -webkit-transform: scale(0.78); transform-origin: 0 0; -webkit-transform-origin: 0 0; }
    }
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: allCss }} />
      <div id="mlb2-29674437" className="ml-form-embedContainer ml-subscribe-form ml-subscribe-form-29674437">
        <div className="ml-form-align-center ">
          <div className="ml-form-embedWrapper embedForm">
            {!isSuccess ? (
              <div className="ml-form-embedBody ml-form-embedBodyDefault row-form">
                <div className="ml-form-embedContent">
                  <h4>En son mizahlar ve bildirilerden haberdar olmak için E-Posta kanalımıza abone ol</h4>
                  <p><br /></p>
                </div>
                <form className="ml-block-form" action="https://assets.mailerlite.com/jsonp/1738794/forms/162904520078133099/subscribe" data-code="" method="post" target="_blank">
                  <div className="ml-form-formContent">
                    <div className="ml-form-fieldRow ml-last-item">
                      <div className="ml-field-group ml-field-email ml-validate-email ml-validate-required">
                        <input aria-label="email" aria-required={true} type="email" className="form-control" data-inputmask="" name="fields[email]" placeholder="E-Posta adresi" autoComplete="email" />
                      </div>
                    </div>
                  </div>
                  <div className="ml-form-embedPermissions">
                    <div className="ml-form-embedPermissionsContent default privacy-policy">
                      <p>İstediğin zaman abonelikten çıkabilirsin<strong></strong></p>
                    </div>
                  </div>
                  <div className="ml-form-interestGroupsRow ml-block-groups ml-validate-required">
                    <div className="ml-form-interestGroupsRowCheckbox group">
                      <label>
                        <input type="checkbox" name="groups[]" value="162894303384831014" />
                        <div className="label-description">Günlük Doz</div>
                      </label>
                    </div>
                    <div className="ml-form-interestGroupsRowCheckbox last-group">
                      <label>
                        <input type="checkbox" name="groups[]" value="162894309928994466" />
                        <div className="label-description">Haftalık Doz</div>
                      </label>
                    </div>
                  </div>
                  <div className="ml-form-recaptcha ml-validate-required" style={{ float: 'left' }}>
                    <div className="g-recaptcha" data-sitekey="6Lf1KHQUAAAAAFNKEX1hdSWCS3mRMv4FlFaNslaD"></div>
                  </div>
                  <input type="hidden" name="ml-submit" value="1" />
                  <div className="ml-form-embedSubmit">
                    <button type="submit" className="primary">Abone Ol</button>
                    <button disabled={true} style={{ display: 'none' }} type="button" className="loading">
                      <div className="ml-form-embedSubmitLoad"></div>
                      <span className="sr-only">Loading...</span>
                    </button>
                  </div>
                  <input type="hidden" name="anticsrf" value="true" />
                </form>
              </div>
            ) : (
              <div className="ml-form-successBody row-success" style={{ display: 'block' }}>
                <div className="ml-form-successContent">
                  <h4>aferin</h4>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default MailFormu;
