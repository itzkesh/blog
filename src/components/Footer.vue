<template>
  <footer class="footer">

    <!-- ===========================
         NEWSLETTER SECTION
    ============================ -->

    <section class="newsletter">

      <div class="container">

        <div class="row align-items-center gy-5">

          <!-- Logo -->

          <div class="col-lg-3">

            <RouterLink
              to="/"
              class="footer-logo"
            >
              <span>Market</span>Hub
            </RouterLink>

          </div>

          <!-- Newsletter -->

          <div class="col-lg-5">

            <h4 class="newsletter-title">
              STAY UPDATED
            </h4>

            <p class="newsletter-text">
              Subscribe to our newsletter and receive updates on
              new arrivals, discounts and exclusive offers.
            </p>

            <form class="newsletter-form">

              <div class="input-group">

                <span class="input-group-text">
                  <i class="bi bi-envelope-fill"></i>
                </span>

                <input
                  type="email"
                  class="form-control"
                  placeholder="Enter your email address"
                >

                <button
                  class="btn btn-subscribe"
                  type="submit"
                >
                  Subscribe
                </button>

              </div>

            </form>

            <div class="form-check mt-3">

              <input
                class="form-check-input"
                type="checkbox"
                id="agree"
              >

              <label
                class="form-check-label"
                for="agree"
              >
                I agree to receive newsletters and promotional offers.
              </label>

            </div>

          </div>

          <!-- Download App -->

          <div class="col-lg-4">

            <div class="download-box">

              <div class="download-icon">

                <i class="bi bi-phone-fill"></i>

              </div>

              <div>

                <h5 class="mb-1">
                  DOWNLOAD OUR APP
                </h5>

                <p class="mb-4">
                  Shop faster and receive exclusive mobile offers.
                </p>

                <div class="d-flex gap-3">

                  <a
                    href="#"
                    class="store-btn"
                  >
                    <i class="bi bi-apple"></i>

                    <div>

                      <small>Download on</small>

                      <strong>App Store</strong>

                    </div>

                  </a>

                  <a
                    href="#"
                    class="store-btn"
                  >
                    <i class="bi bi-google-play"></i>

                    <div>

                      <small>GET IT ON</small>

                      <strong>Google Play</strong>

                    </div>

                  </a>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </section>

    <!-- PART 2 STARTS HERE -->

    <section class="footer-links">

      <div class="container">

        <div class="row g-5">
                      <!-- Customer Support -->
          <div class="col-lg-3 col-md-6">

            <h5 class="footer-title">
              Customer Support
            </h5>

            <ul class="footer-list">

              <li>
                <RouterLink to="/contact">
                  Contact Us
                </RouterLink>
              </li>

              <li>
                <RouterLink to="/help">
                  Help Center
                </RouterLink>
              </li>

              <li>
                <RouterLink to="/shipping">
                  Shipping Information
                </RouterLink>
              </li>

              <li>
                <RouterLink to="/returns">
                  Returns & Refunds
                </RouterLink>
              </li>

              <li>
                <RouterLink to="/faq">
                  Frequently Asked Questions
                </RouterLink>
              </li>

            </ul>

          </div>

          <!-- About -->

          <div class="col-lg-3 col-md-6">

            <h5 class="footer-title">
              About Marketplace
            </h5>

            <ul class="footer-list">

              <li>
                <RouterLink to="/about">
                  About Us
                </RouterLink>
              </li>

              <li>
                <RouterLink to="/careers">
                  Careers
                </RouterLink>
              </li>

              <li>
                <RouterLink to="/privacy">
                  Privacy Policy
                </RouterLink>
              </li>

              <li>
                <RouterLink to="/terms">
                  Terms & Conditions
                </RouterLink>
              </li>

              <li>
                <RouterLink to="/blog">
                  Blog
                </RouterLink>
              </li>

            </ul>

          </div>

          <!-- Seller -->

          <div class="col-lg-3 col-md-6">

            <h5 class="footer-title">
              Sell With Us
            </h5>

            <ul class="footer-list">

              <li>
                <RouterLink to="/seller/register">
                  Become a Seller
                </RouterLink>
              </li>

              <li>
                <RouterLink to="/seller/login">
                  Seller Login
                </RouterLink>
              </li>

              <li>
                <RouterLink to="/seller/dashboard">
                  Seller Dashboard
                </RouterLink>
              </li>

              <li>
                <RouterLink to="/seller-guide">
                  Seller Guide
                </RouterLink>
              </li>

              <li>
                <RouterLink to="/affiliate">
                  Affiliate Program
                </RouterLink>
              </li>

            </ul>

          </div>

          <!-- Contact -->

          <div class="col-lg-3 col-md-6">

            <h5 class="footer-title">
              Contact Us
            </h5>

            <ul class="footer-contact">

              <li>

                <i class="bi bi-geo-alt-fill"></i>

                <span>
                  Lagos, Nigeria
                </span>

              </li>

              <li>

                <i class="bi bi-telephone-fill"></i>

                <span>
                  +234 800 123 4567
                </span>

              </li>

              <li>

                <i class="bi bi-envelope-fill"></i>

                <span>
                  support@markethub.com
                </span>

              </li>

              <li>

                <i class="bi bi-clock-fill"></i>

                <span>
                  Mon - Sat: 8:00AM - 8:00PM
                </span>

              </li>

            </ul>

          </div>

        </div>

        <hr class="footer-divider">

        <!-- Bottom -->

        <div class="footer-bottom">

          <div class="social-icons">

            <a href="#">
              <i class="bi bi-facebook"></i>
            </a>

            <a href="#">
              <i class="bi bi-instagram"></i>
            </a>

            <a href="#">
              <i class="bi bi-twitter-x"></i>
            </a>

            <a href="#">
              <i class="bi bi-youtube"></i>
            </a>

            <a href="#">
              <i class="bi bi-linkedin"></i>
            </a>

          </div>

          <div class="payment-methods">

            <span class="payment-title">
              Accepted Payments
            </span>

            <div class="payment-icons">

              <i class="bi bi-credit-card-2-front-fill"></i>

              <span>Visa</span>

              <span>Mastercard</span>

              <span>Verve</span>

              <span>Paystack</span>

              <span>Flutterwave</span>

            </div>

          </div>

        </div>

        <div class="copyright">

          © {{ new Date().getFullYear() }}
          MarketHub. All Rights Reserved.

        </div>

      </div>

    </section>

  </footer>
</template>

<style scoped>

/* =========================
   FOOTER
========================= */

.footer{
    background:#111827;
    color:#d1d5db;
    margin-top:100px;
}

/* =========================
   NEWSLETTER
========================= */

.newsletter{
    padding:70px 0;
    border-bottom:1px solid rgba(255,255,255,.08);
}

.footer-logo{
    font-size:2rem;
    font-weight:800;
    color:#fff;
    text-decoration:none;
}

.footer-logo span{
    color:#2563eb;
}

.newsletter-title{
    color:#fff;
    font-weight:700;
    margin-bottom:12px;
}

.newsletter-text{
    color:#9ca3af;
    line-height:1.7;
    margin-bottom:25px;
}

.newsletter-form .form-control{
    height:56px;
    border:none;
    box-shadow:none;
}

.newsletter-form .input-group-text{
    background:#fff;
    border:none;
}

.btn-subscribe{
    background:linear-gradient(135deg,#2563eb,#4f46e5);
    color:#fff;
    border:none;
    padding:0 30px;
    font-weight:600;
    transition:.35s;
}

.btn-subscribe:hover{
    transform:translateY(-2px);
    box-shadow:0 10px 25px rgba(37,99,235,.35);
}

.form-check-label{
    color:#9ca3af;
    font-size:.9rem;
}

/* =========================
   DOWNLOAD BOX
========================= */

.download-box{
    background:#1f2937;
    border-radius:20px;
    padding:25px;
    display:flex;
    gap:20px;
    align-items:flex-start;
    transition:.35s;
}

.download-box:hover{
    transform:translateY(-6px);
    box-shadow:0 18px 35px rgba(0,0,0,.35);
}

.download-icon{
    width:70px;
    height:70px;
    background:linear-gradient(135deg,#2563eb,#4f46e5);
    border-radius:18px;
    display:flex;
    justify-content:center;
    align-items:center;
    font-size:28px;
    color:#fff;
}

.download-box h5{
    color:#fff;
    font-weight:700;
}

.download-box p{
    color:#9ca3af;
}

.store-btn{
    background:#111827;
    border:1px solid rgba(255,255,255,.1);
    color:#fff;
    text-decoration:none;
    border-radius:14px;
    padding:12px 18px;
    display:flex;
    align-items:center;
    gap:14px;
    transition:.35s;
}

.store-btn:hover{
    background:#2563eb;
    color:#fff;
    transform:translateY(-3px);
}

.store-btn i{
    font-size:28px;
}

.store-btn small{
    display:block;
    color:#d1d5db;
    font-size:.75rem;
}

.store-btn strong{
    display:block;
    font-size:.95rem;
}

/* =========================
   LINKS
========================= */

.footer-links{
    padding:70px 0 35px;
}

.footer-title{
    color:#fff;
    margin-bottom:22px;
    font-weight:700;
}

.footer-list{
    list-style:none;
    padding:0;
    margin:0;
}

.footer-list li{
    margin-bottom:14px;
}

.footer-list a{
    color:#9ca3af;
    text-decoration:none;
    transition:.3s;
}

.footer-list a:hover{
    color:#2563eb;
    padding-left:8px;
}

/* =========================
   CONTACT
========================= */

.footer-contact{
    list-style:none;
    padding:0;
}

.footer-contact li{
    display:flex;
    gap:14px;
    margin-bottom:18px;
    color:#9ca3af;
}

.footer-contact i{
    color:#2563eb;
    font-size:18px;
    margin-top:3px;
}

/* =========================
   DIVIDER
========================= */

.footer-divider{
    border-color:rgba(255,255,255,.08);
    margin:45px 0;
}

/* =========================
   BOTTOM
========================= */

.footer-bottom{
    display:flex;
    justify-content:space-between;
    align-items:center;
    flex-wrap:wrap;
    gap:30px;
}

.social-icons{
    display:flex;
    gap:14px;
}

.social-icons a{
    width:45px;
    height:45px;
    background:#1f2937;
    border-radius:50%;
    display:flex;
    justify-content:center;
    align-items:center;
    color:#fff;
    text-decoration:none;
    transition:.35s;
}

.social-icons a:hover{
    background:#2563eb;
    transform:translateY(-5px);
}

.social-icons i{
    font-size:18px;
}

.payment-title{
    color:#fff;
    font-weight:600;
    margin-right:20px;
}

.payment-methods{
    display:flex;
    align-items:center;
    flex-wrap:wrap;
    gap:15px;
}

.payment-icons{
    display:flex;
    align-items:center;
    flex-wrap:wrap;
    gap:12px;
}

.payment-icons span{
    background:#1f2937;
    padding:10px 16px;
    border-radius:10px;
    color:#fff;
    font-size:.9rem;
    transition:.3s;
}

.payment-icons span:hover{
    background:#2563eb;
}

.payment-icons i{
    font-size:24px;
    color:#fff;
}

/* =========================
   COPYRIGHT
========================= */

.copyright{
    text-align:center;
    color:#9ca3af;
    margin-top:45px;
    padding-top:25px;
    border-top:1px solid rgba(255,255,255,.08);
    font-size:.95rem;
}

/* =========================
   ANIMATIONS
========================= */

.newsletter,
.footer-links{
    animation:fadeUp .8s ease;
}

@keyframes fadeUp{

    from{
        opacity:0;
        transform:translateY(40px);
    }

    to{
        opacity:1;
        transform:translateY(0);
    }

}

/* =========================
   RESPONSIVE
========================= */

@media(max-width:991px){

    .download-box{
        margin-top:25px;
    }

    .footer-bottom{
        flex-direction:column;
        align-items:flex-start;
    }

}

@media(max-width:768px){

    .newsletter{
        padding:50px 0;
    }

    .footer-links{
        padding:50px 0 30px;
    }

    .newsletter-form .input-group{
        display:block;
    }

    .newsletter-form .input-group-text{
        display:none;
    }

    .newsletter-form .form-control{
        width:100%;
        margin-bottom:15px;
        border-radius:12px !important;
    }

    .btn-subscribe{
        width:100%;
        border-radius:12px;
        height:52px;
    }

    .download-box{
        flex-direction:column;
        text-align:center;
    }

    .store-btn{
        justify-content:center;
        width:100%;
    }

    .payment-methods{
        flex-direction:column;
        align-items:flex-start;
    }

}

</style>