import Map "mo:core/Map";
import Array "mo:core/Array";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";

actor {
  include MixinStorage();

  type ProductId = Nat;
  type Product = {
    id : ProductId;
    name : Text;
    description : Text;
    price : Nat;
    imageUrl : Text;
    designUrl : Storage.ExternalBlob;
    available : Bool;
  };

  type OrderId = Nat;
  type OrderType = {
    id : OrderId;
    productId : ProductId;
    productName : Text;
    customerName : Text;
    email : Text;
    phone : Text;
    streetAddress : Text;
    city : Text;
    state : Text;
    pincode : Text;
    timestamp : Time.Time;
    status : Text; // "pending", "shipped", "delivered"
  };

  public type UserProfile = {
    name : Text;
  };

  let products = Map.empty<ProductId, Product>();
  let orders = Map.empty<OrderId, OrderType>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  var nextProductId : ProductId = 1;
  var nextOrderId : OrderId = 1;

  module Product {
    public func compare(p1 : Product, p2 : Product) : Order.Order {
      Nat.compare(p1.id, p2.id);
    };
  };

  module OrderModule {
    public func compare(o1 : OrderType, o2 : OrderType) : Order.Order {
      Nat.compare(o1.id, o2.id);
    };
  };

  // Initialize authorization system
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User Profile Management

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Product Management

  public shared ({ caller }) func addProduct(name : Text, description : Text, price : Nat, imageUrl : Text, designUrl : Storage.ExternalBlob, available : Bool) : async ProductId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };

    let productId = nextProductId;
    nextProductId += 1;

    let product : Product = {
      id = productId;
      name;
      description;
      price;
      imageUrl;
      designUrl;
      available;
    };
    products.add(productId, product);
    productId;
  };

  public shared ({ caller }) func updateProduct(productId : ProductId, name : Text, description : Text, price : Nat, imageUrl : Text, designUrl : Storage.ExternalBlob, available : Bool) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };

    switch (products.get(productId)) {
      case (null) { Runtime.trap("Product not found") };
      case (?_) {
        let updatedProduct : Product = {
          id = productId;
          name;
          description;
          price;
          imageUrl;
          designUrl;
          available;
        };
        products.add(productId, updatedProduct);
      };
    };
  };

  public shared ({ caller }) func deleteProduct(productId : ProductId) : async () {
    if (not products.containsKey(productId)) {
      Runtime.trap("Product not found");
    };
    products.remove(productId);
  };

  public query ({ caller }) func getProduct(productId : ProductId) : async Product {
    switch (products.get(productId)) {
      case (null) { Runtime.trap("Product not found") };
      case (?product) { product };
    };
  };

  public query ({ caller }) func listProducts() : async [Product] {
    products.values().toArray().sort();
  };

  // Order Management

  public shared ({ caller }) func placeOrder(productId : ProductId, productName : Text, customerName : Text, email : Text, phone : Text, streetAddress : Text, city : Text, state : Text, pincode : Text) : async OrderId {
    if (customerName == "" or email == "" or phone == "" or streetAddress == "" or city == "" or state == "" or pincode == "") {
      Runtime.trap("All fields must be filled");
    };

    let orderId = nextOrderId;
    nextOrderId += 1;

    let order : OrderType = {
      id = orderId;
      productId;
      productName;
      customerName;
      email;
      phone;
      streetAddress;
      city;
      state;
      pincode;
      timestamp = Time.now();
      status = "pending";
    };
    orders.add(orderId, order);
    orderId;
  };

  public query ({ caller }) func getOrder(orderId : OrderId) : async OrderType {
    switch (orders.get(orderId)) {
      case (null) { Runtime.trap("Order not found") };
      case (?order) { order };
    };
  };

  public query ({ caller }) func listOrders() : async [OrderType] {
    orders.values().toArray().sort();
  };

  public shared ({ caller }) func updateOrderStatus(orderId : OrderId, status : Text) : async () {
    switch (orders.get(orderId)) {
      case (null) { Runtime.trap("Order not found") };
      case (?order) {
        let updatedOrder : OrderType = {
          id = order.id;
          productId = order.productId;
          productName = order.productName;
          customerName = order.customerName;
          email = order.email;
          phone = order.phone;
          streetAddress = order.streetAddress;
          city = order.city;
          state = order.state;
          pincode = order.pincode;
          timestamp = order.timestamp;
          status;
        };
        orders.add(orderId, updatedOrder);
      };
    };
  };
};
