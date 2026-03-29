
<div id="admin-security-panel" class="admin-panel" style="display: none;">
    <div class="admin-panel-content">
        <h2>🔐 Admin Security</h2>
        
            <div class="tabs">
        
                <!-- TAB 1 -->
                <input type="radio" name="glass-tabs" id="t1" checked>
                <label for="t1">PERMISSION</label>
                <div class="tab-content">
                    
                    <div class="tab-info-text-style">
                        <h1>ADMIN OR OPERATOR BY MOBIL NUMBER VERIFICATION</h1>
                        <p>1. Enter with your mobile number and click send button</p>
                        <p>2. After write back the verification 8 digit code and click the VERIFY button </p>
                        <p>3. After you will know, that entered ADMIN or OPERATOR permission </p>
                    </div>
                    
                    <!-- PERMISSION menü -->
                    <div class="menu-item">
                        <button class="menu-main-btn" data-target="submenu-permission"> 
                            PERMISSION <i class="fa fa-angle-double-down" aria-hidden="true"></i>
                        </button>
            
                        <div id="submenu-permission" class="submenu" style="display: none;">
                
                            <!-- 1. lépés: mobilszám bekérés -->
                            <div class="admin-input-group" id="step1" style="display: block;">
                                <input type="text" id="mobile-input" class="admin-input" placeholder="e.g. +36301234567" autocomplete="off">
                                <button id="send-mobile-btn" class="admin-action-btn" style="display: flex;">SEND</button>
                                <button id="resend-code-btn" class="admin-action-btn" style="display: none;">RESEND</button>
                                <div id="mobile-error" class="admin-error-msg"></div>
                            </div>    
                    
                            <!-- 2. lépés: kód bekérés (kezdetben rejtett) -->
                            <div class="admin-input-group" id="step2" style="display: none;">
                                <input type="text" id="code-input" class="admin-input" placeholder="Enter 8-character code" maxlength="8">
                                <button id="verify-code-btn" class="admin-action-btn">VERIFY</button>
                                
                                <div id="code-error" class="admin-error-msg"></div>
                            </div>
        
                            <div id="permission-status" class="admin-status"></div>
                                
                            <div class="countdown-stepper-timer" id="countdown-timer" style="display: none;"></div>
                
                        </div>
                    </div>
                </div>
        
        
                <!-- TAB 2 -->
                <input type="radio" name="glass-tabs" id="t2">
                <label for="t2">IP MANAGER</label>
                <div class="tab-content">
                    <div class="tab-info-text-style">
                        <h1>COUNTRY OR PERSONAL IP MANAGER</h1>
                            <p>COUNTRY IP BLOCKING/UNBLOCKING</p>
                            <p>COUNTRY IP BLOCKED/UNBLOCKED LIST</p>
                            <p>PERSONAL IP BLOCKING/UNBLOCKING</p>
                            <p>PERSONAL IP BLOCKED/UNBLOCKED LIST</p>
                    </div>
                    
                    <div class="menu-item inactive" id="country-ip-blocking-menu">
                        <button class="menu-main-btn" data-target="submenu-country">
                            COUNTRY IP BLOCKING <i class="fa fa-angle-double-down" aria-hidden="true"></i>
                        </button>
                        <div id="submenu-country" class="submenu" style="display: none;">
                        
                            <!-- Ide jön a dropdown -->
                            <div id="country-dropdown"></div>
                            
                                <!-- Mentés gomb a változások mentéséhez -->
                                <button id="save-country-blocking" class="admin-action-btn" style="margin-top: 15px;">💾 SAVE</button>
                        </div>      
                        
                    </div>
                
                    <div class="menu-item inactive">
                        <button class="menu-main-btn">
                            COUNTRY IP BLOCKED LIST <i class="fa fa-angle-double-down" aria-hidden="true"></i>
                        </button>
                        <div class="submenu" style="display: none;">...</div>
                    </div>
                
                    <div class="menu-item inactive">
                        <button class="menu-main-btn">
                            PERSONAL IP BLOCKING <i class="fa fa-angle-double-down" aria-hidden="true"></i>
                        </button>
                        <div class="submenu" style="display: none;">...</div>
                    </div>
                
                    <div class="menu-item inactive">
                        <button class="menu-main-btn">
                            PERSONAL IP BLOCKED LIST <i class="fa fa-angle-double-down" aria-hidden="true"></i>
                        </button>
                        <div class="submenu" style="display: none;">...</div>
                    </div>
                </div>
        
                
                
                <!-- TAB 3 -->
                <input type="radio" name="glass-tabs" id="t3">
                <label for="t3">PRICE PLAN</label>
                <div class="tab-content">
                    
                    <div class="tab-info-text-style">
                        <h1>OUR PRICE PLAN</h1>
                        <p>Here you need to set the price for 4 Subscribe plan</p>
                         <p>2 menu have, one where set from subsribe price 1-4 and with poor, midle, rich price</p>  
                            <p>other item, where finally need to attach country</p>
                            <p>example => "PH" + POOR PRICE: TRUE | MIDDLE PRICE: FALSE | RICH PRICE: FALSE</p>                             
                            <p>The subscription only applies to the purchase of the processor (CPU), everything else is allowed to buy in the webshop.</p>
                    </div>    
                        
                    <div class="menu-item inactive" id="price-plan-menu">
                            <button class="menu-main-btn" data-target="submenu-priceplan">
                                OUR 4 SUBSCRIBE PRICE PLAN <i class="fa fa-angle-double-down" aria-hidden="true"></i>
                            </button>
                            <div id="submenu-ourpriceplan" class="submenu" style="display: none;">
                                <div class="4_subscribe" id="4_subscribe_price_engine">
                                    <div class="controls">
                                        <div class="search-box">
                                            <i class="fas fa-search"></i>
                                            <input type="text" id="searchInput" placeholder="Search in table...">
                                        </div>

                                        <div class="select_subsription_group">
                                            <select id="planSelector" required> 
                                                <option value="">SELECT SUBSCRIPTION</option>
                                                <option value="SUBSCRIPTION PRICE PLAN 1">SUBSCRIPTION PRICE PLAN 1</option>
                                                <option value="SUBSCRIPTION PRICE PLAN 2">SUBSCRIPTION PRICE PLAN 2</option>
                                                <option value="SUBSCRIPTION PRICE PLAN 3">SUBSCRIPTION PRICE PLAN 3</option>
                                                <option value="SUBSCRIPTION PRICE PLAN 4">SUBSCRIPTION PRICE PLAN 4</option>
                                            </select>
                                        </div>

                                        <div>
                                            <button class="btn btn-success" id="addRowBtn">
                                                <i class="fas fa-plus-circle"></i> Add New Row
                                            </button>
                                            
                                            <!--
                                            <button class="btn btn-danger" id="deleteSelectedBtn" style="display: none;">
                                                <i class="fas fa-trash-alt"></i> Delete Selected
                                            </button>
                                            -->
                                        </div>
                                    </div>

                                    <div class="table-container">
                                        <table id="dataTable">
                                            <thead>
                                                <tr>
                                                    <!--
                                                    <th width="50">
                                                        <input type="checkbox" id="selectAll">
                                                    </th>
                                                    -->
                                                    <th width="50">ID</th>
                                                    <th>POOR ($)</th>
                                                    <th>MIDDLE ($)</th>
                                                    <th>RICH ($)</th>
                                                    <th>MAX KG CPU TO BUY</th>
                                                    <th>EDIT/DELETE</th>
                                                </tr>
                                            </thead>
                                            
                                            <tbody id="tableBody">
                                                <!-- Table rows will be generated here -->
                                            </tbody>
                                        </table>
                                        
                                        <div id="emptyState" class="empty-state">
                                            <i class="fas fa-table"></i>
                                            <h3>No Data Available</h3>
                                            <p>Click the "Add New Row" button to add your first entry.</p>
                                        </div>
                                    </div>

                                    <!-- Modal for adding/editing rows -->
                                    <div id="rowModal" class="modal">
                                        <div class="modal-content">
                                            <h3>Add New Row</h3>
                                            <form id="addForm">
                                                <input type="number" id="poor_price" placeholder="Poor Price" required>
                                                <input type="number" id="middle_price" placeholder="Middle Price" required>
                                                <input type="number" id="rich_price" placeholder="Rich Price" required>
                                                <input type="number" id="max_cpu" placeholder="Max KG CPU" required>
                                                <div class="modal-btns">
                                                    <button type="button" id="closeModal" class="btn-cancel">CANCEL</button>
                                                    <button type="submit" class="btn-save">💾 SAVE DATA</button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>


                                </div>

                            </div>
                        </div>

                        <div class="menu-item inactive" id="attach-counrtry-price-plan-menu">
                            <button class="menu-main-btn" data-target="submenu-attach-country-priceplan">
                                COUNTRY ATTACH FOR PRICE PLAN <i class="fa fa-angle-double-down" aria-hidden="true"></i>
                            </button>
                            <div id="submenu-attach-country-forourpriceplan" class="submenu" style="display: none;">
                                <div class="country-attach-formtable" id="country-attach-formtable-engine" >
                                    <div >

                                        <!-- IDE JÖN A TRUE/FALSE ATTACH COUNTRY TABLE -->

                                    </div>
                                </div>
                            </div>
                        </div>
                        
                </div>
        

        
                <!-- TAB 4 -->
                <input type="radio" name="glass-tabs" id="t4">
                <label for="t4">SUPPLIER</label>
                <div class="tab-content">
                    <div class="tab-info-text-style">
        
                        <h1>SUPPLIER MANAGER</h1>
                            <p>SUPPLIERS CONTACT DETAILS</p>
                            <p>Here we will save the suppliers company details (website, address, email, phone)</p><br/>
                            
                            <p>SUPPLIERS PRICE BUILDER AND OUR ORDERING</p><br/>
                            <p>
                                STEP 1 => examp. Beaker glass(1L) => ordering(50 PCS) => DDP service => https://sourcingpioneer.com => They do it everithing.. <br/>
                                STEP 2 => How run this process with DDP => They carry from manufacture garage our product to Philippine Warehouse(in Davao or Tagum Logistic center such a L3P) <br/>   
                                STEP 3 => L3P (already we have with them contract) receive our product and they save in the server all info(who is company product, how many pcs arrived and...) <br/>
                                STEP 4 => L3P server send message our website, 'Hello your product arrived, we save your database of website this delivery' <br/>
                                STEP 5 => And in our webshop make refresh, and show the customer the quantity. <br/>
                                So how is this supplier pricing structured? Manufacture price + DDP price + L3P price + PayMongo transaction price = This price clear net webshop price.<br/>
                            </p>    
                    </div>
                    
                    <div class="menu-item inactive">
                        <button class="menu-main-btn">
                            SUPPLIER MANAGER <i class="fa fa-angle-double-down" aria-hidden="true"></i>
                        </button>
                        <div class="submenu" style="display: none;">...</div>
                    </div>
                
                    
                </div>

        
                <!-- TAB 5 -->
                <input type="radio" name="glass-tabs" id="t5">
                <label for="t5">WEBSHOP</label>
                <div class="tab-content">
                    <div class="tab-info-text-style">
                        <h1>WEBSHOP MANAGER</h1>
                            <p>1. WEBSHOP PRICE BUILDER</p> 
                            <p>2. COUNTRY TAX FEE</p>
                            <p>3. SHIPPING PRICE</p>
                            <p>
                                SUPPLIER PRICE AND OUR ORDERING 
                                STEP 1 => examp. Beaker glass(1L) => ordering(50 PCS) => https://sourcingpioneer.com => They do it everithing 
                                STEP 2 => How turn our s 
                                STEP 3 => WEBSHOP PRICE BUILDER => 1 PCS BEAKER GLASS PRICE(1L) 20,75 USD + EACH COUNTRY TAX(EXAMP. 15%) + SHIPPING COST(25 USD)
                            </p>
                    </div>
                    <div class="menu-item inactive">
                        <button class="menu-main-btn">
                            WEBSHOP MANAGER <i class="fa fa-angle-double-down" aria-hidden="true"></i>
                        </button>
                        <div class="submenu" style="display: none;">...</div>
                    </div>
                </div>
            


                <!-- TAB 6 -->
                <input type="radio" name="glass-tabs" id="t6">
                <label for="t6">MONEY MANAGER</label>
                <div class="tab-content">
        
                    <div class="tab-info-text-style">
                        <h1>ABOUT PRICE HANDLE</h1>
                            <p>OUR PRICE PLAN</p>
                            <p>SUPPLIERS PRICE</p>
                            <p>WEBSHOP PRICE</p>
                    </div>

                    <div class="menu-item inactive" id="our-price-plan-menu">
                        <button class="menu-main-btn" data-target="submenu-ourpriceplan">
                            OUR PRICE PLAN <i class="fa fa-angle-double-down" aria-hidden="true"></i>
                        </button>
                        <div id="our-price-plan-menu" class="submenu" style="display: none;">
                        
                        <!-- IDE JÖN A PRICE PLAN RENDSZER-->
                        
                        </div>
                    </div>
                    
                    
                    <div class="menu-item inactive" id="suppliers-menu">
                        <button class="menu-main-btn" data-target="submenu-suppliers">
                            SUPPLIERS PRICE <i class="fa fa-angle-double-down" aria-hidden="true"></i>
                        </button>
                        <div id="suppliers-price-menu" class="submenu" style="display: none;">
                        
                        <!-- IDE JÖN A SUPPLIERS PRICE RENDSZER-->
                        
                        </div>
                    </div>
                    
                    
                    <div class="menu-item inactive" id="webshop-menu">
                        <button class="menu-main-btn" data-target="submenu-webshop">
                            WEBSHOP PRICE <i class="fa fa-angle-double-down" aria-hidden="true"></i>
                        </button>
                        <div id="webshop-price-menu" class="submenu" style="display: none;">
                        
                        <!-- IDE JÖN A WEBSHOP PRICE RENDSZER-->
                        
                        </div>
                    </div>
                    
        
                </div>
            </div>

        
        <div class="admin-buttons">
            <button id="admin-save-btn" class="admin-btn save-btn">💾 SAVE</button>
            <button id="admin-exit-btn" class="admin-btn exit-btn">✖ EXIT</button>
        </div>
    </div>
</div>
