/*
 * @author zz85 / https://github.com/zz85
 * @author mrdoob / http://mrdoob.com
 * Running this will allow you to drag three.js objects around the screen.
 */

import {
  Camera,
  Plane,
  Raycaster,
  Vector2,
  Vector3,
  EventDispatcher
} from "three";

const USE_POINTER_EVENTS = "onpointerdown" in document.createElement("div");
const MOVE = USE_POINTER_EVENTS ? "pointermove" : "touchmove";
const START = USE_POINTER_EVENTS ? "pointerdown" : "touchstart";
const END = USE_POINTER_EVENTS ? "pointerup" : "touchend";
const CANCEL = USE_POINTER_EVENTS ? "pointercancel" : "touchcancel";

const DragControls = function(_objects, _camera, _domElement) {
  if (_objects instanceof Camera) {
    console.warn(
      "THREE.DragControls: Constructor now expects ( objects, camera, domElement )"
    );
    var temp = _objects;
    _objects = _camera;
    _camera = temp;
  }

  var _plane = new Plane(new Vector3(0, 0, 1));
  var _raycaster = new Raycaster();

  var _mouse = new Vector2();
  var _offset = new Vector3();
  var _intersection = new Vector3();

  var _selected = null,
    _hovered = null;

  //

  var scope = this;

  function activate() {
    _domElement.addEventListener(MOVE, onDocumentMouseMove);
    _domElement.addEventListener(START, onDocumentMouseDown, {
      passive: false
    });
    _domElement.addEventListener(END, onDocumentMouseUp, { passive: false });
    _domElement.addEventListener(CANCEL, onDocumentMouseUp, { passive: false });
  }

  function deactivate() {
    _domElement.removeEventListener(MOVE, onDocumentMouseMove);
    _domElement.removeEventListener(START, onDocumentMouseDown);
    _domElement.removeEventListener(END, onDocumentMouseUp);
    _domElement.removeEventListener(CANCEL, onDocumentMouseUp);
  }

  function dispose() {
    deactivate();
  }

  function onDocumentMouseMove(event) {
    event.preventDefault();

    var rect = _domElement.getBoundingClientRect();

    _mouse.x = (event.clientX - rect.left) / rect.width * 2 - 1;
    _mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    _raycaster.setFromCamera(_mouse, _camera);

    if (_selected && scope.enabled) {
      if (_raycaster.ray.intersectPlane(_plane, _intersection)) {
        _selected.position.copy(_intersection.sub(_offset));
      }

      scope.dispatchEvent({ type: "drag", object: _selected });

      return;
    }

    _raycaster.setFromCamera(_mouse, _camera);

    var intersects = _raycaster.intersectObjects(_objects);

    if (intersects.length > 0) {
      var object = intersects[0].object;

      // _plane.setFromNormalAndCoplanarPoint(
      //   _camera.getWorldDirection(_plane.normal),
      //   object.position
      // );

      if (_hovered !== object) {
        scope.dispatchEvent({ type: "hoveron", object: object });

        _domElement.style.cursor = "pointer";
        _hovered = object;
      }
    } else {
      if (_hovered !== null) {
        scope.dispatchEvent({ type: "hoveroff", object: _hovered });

        _domElement.style.cursor = "auto";
        _hovered = null;
      }
    }
  }

  function onDocumentMouseDown(event) {
    var rect = _domElement.getBoundingClientRect();
    _mouse.x = (event.clientX - rect.left) / rect.width * 2 - 1;
    _mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    _raycaster.setFromCamera(_mouse, _camera);

    var intersects = _raycaster.intersectObjects(_objects);

    if (intersects.length > 0) {
      _selected = intersects[0].object;

      if (_raycaster.ray.intersectPlane(_plane, _intersection)) {
        _offset.copy(_intersection).sub(_selected.position);
      }

      _domElement.style.cursor = "move";

      scope.dispatchEvent({ type: "dragstart", object: _selected });
    }
  }

  function onDocumentMouseUp(event) {
    if (_selected) {
      scope.dispatchEvent({ type: "dragend", object: _selected });

      _selected = null;
    }

    _domElement.style.cursor = "auto";
  }

  activate();

  // API

  this.enabled = true;

  this.activate = activate;
  this.deactivate = deactivate;
  this.dispose = dispose;
};

DragControls.prototype = Object.create(EventDispatcher.prototype);
DragControls.prototype.constructor = DragControls;

export default DragControls;
